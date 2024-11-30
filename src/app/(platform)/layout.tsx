import { ClerkProvider } from "@clerk/nextjs";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <div className="min-h-screen bg-gray-100">{children}</div>
    </ClerkProvider>
  );
};

export default PlatformLayout;
