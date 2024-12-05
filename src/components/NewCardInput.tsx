import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

interface NewCardInputProps {
  workspaceId: string; // Add this line
  boardId: string;
}

const NewCardInput: React.FC<NewCardInputProps> = ({
  workspaceId,
  boardId,
}) => {
  const [cardText, setCardText] = useState("");
  const { addCard } = useWorkspaceStore();

  const handleAddCard = () => {
    if (!cardText.trim()) return;
    addCard(workspaceId, boardId, cardText); // Update this line
    setCardText("");
  };

  return (
    <div className="flex mb-4">
      <input
        type="text"
        value={cardText}
        onChange={(e) => setCardText(e.target.value)}
        placeholder="New card"
        className="border p-2 mr-2 flex-grow"
        onKeyDown={(e) => e.key === "Enter" && handleAddCard()}
      />
      <button
        onClick={handleAddCard}
        className="bg-green-500 text-white p-2 rounded"
      >
        <PlusIcon size={16} />
      </button>
    </div>
  );
};

export default NewCardInput;
