import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useBoardStore } from "@/store/useBoardStore";

interface NewCardInputProps {
  boardId: string;
}

const NewCardInput: React.FC<NewCardInputProps> = ({ boardId }) => {
  const [cardText, setCardText] = useState("");
  const { addCard } = useBoardStore();

  const handleAddCard = () => {
    if (!cardText.trim()) return;
    addCard(boardId, cardText);
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
