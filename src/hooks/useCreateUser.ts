import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export function useCreateUser() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      const createUser = async () => {
        try {
          if (
            user.primaryEmailAddress &&
            user.fullName &&
            user.imageUrl &&
            user.id
          ) {
            const response = await fetch("/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.primaryEmailAddress.emailAddress,
                name: user.fullName,
                profilePicture: user.imageUrl,
                id: user.id,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error("Error creating user:", errorData);
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("User created successfully");
          }
        } catch (error) {
          console.error("Error in createUser:", error);
        }
      };

      createUser();
    }
  }, [isSignedIn, user]);
}
