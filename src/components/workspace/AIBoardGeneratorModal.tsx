// components/workspace/AIBoardGeneratorModal.tsx
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Loader2 } from "lucide-react";
import { Modal } from "./Modal";
import { Board as BoardType, Card as CardType } from "../../types";

interface AIBoardGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: number;
  onBoardsCreated: (boards: BoardType[]) => void;
}

export const AIBoardGeneratorModal: React.FC<AIBoardGeneratorModalProps> = ({
  isOpen,
  onClose,
  workspaceId,
  onBoardsCreated,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  const generateAIBoards = async () => {
    if (!prompt.trim()) {
      setAiError("Please enter a prompt");
      return;
    }

    setAiError("");
    setIsGenerating(true);

    try {
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Create a prompt that asks for structured JSON
      const formattedPrompt = `
        Create a kanban board structure based on the following request: "${prompt}"
        
        Respond ONLY with valid JSON in the following format:
        {
          "boards": [
            {
              "name": "Board Name",
              "cards": [
                {
                  "title": "Card Title",
                  "description": "Detailed description of the card"
                }
              ]
            }
          ]
        }
        
        Create as many boards and cards as told by the user. If the number is not specified, create as much as needed.
      `;

      const result = await model.generateContent(formattedPrompt);
      const responseText = result.response.text();

      // Extract the JSON from the response
      let jsonData;
      try {
        // First try to parse the entire response as JSON
        jsonData = JSON.parse(responseText);
      } catch (error) {
        // If that fails, try to extract JSON from the response text
        console.log("Error parsing JSON:", error);
        const jsonMatch =
          responseText.match(/```json\s*({[\s\S]*?})\s*```/) ||
          responseText.match(/{[\s\S]*?}/);

        if (jsonMatch && jsonMatch[1]) {
          jsonData = JSON.parse(jsonMatch[1]);
        } else {
          throw new Error("Could not parse JSON from response");
        }
      }

      // Create the boards and cards from the parsed JSON
      if (jsonData && jsonData.boards && Array.isArray(jsonData.boards)) {
        const createdBoards: BoardType[] = [];

        // Create each board with its cards
        for (const boardData of jsonData.boards) {
          const boardResponse = await fetch(`/api/boards`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: boardData.name,
              workspaceId,
            }),
          });

          if (boardResponse.ok) {
            const newBoard: BoardType = await boardResponse.json();
            const cards: CardType[] = [];

            // Create cards for this board
            if (boardData.cards && Array.isArray(boardData.cards)) {
              for (const cardData of boardData.cards) {
                const cardResponse = await fetch("/api/cards", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: cardData.title,
                    description: cardData.description || "",
                    boardId: newBoard.id,
                  }),
                });

                if (cardResponse.ok) {
                  const card: CardType = await cardResponse.json();
                  cards.push(card);
                }
              }
            }

            createdBoards.push({ ...newBoard, cards });
          }
        }

        onBoardsCreated(createdBoards);
        onClose();
        setPrompt("");
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error("Error generating boards:", error);
      setAiError("Failed to generate boards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Generate Boards"
      description="Describe what kind of boards and cards you want to create, and our AI will generate them for you."
    >
      <div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Create a project management setup for a website redesign project with appropriate boards and tasks..."
          rows={6}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 resize-none"
        />
        {aiError && <p className="text-red-500 mb-3">{aiError}</p>}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button
            onClick={generateAIBoards}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              "Generate Boards"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
