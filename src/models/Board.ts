import mongoose from "mongoose";

const CardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    position: {
      type: Number,
      required: true, // Used for ordering
    },
  },
  { timestamps: true }
);

const BoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace", // Reference the Workspace model
      required: true,
    },
    cards: {
      type: [CardSchema], // Embed cards within the board
      default: [],
    },
  },
  { timestamps: true }
);

export const Board = mongoose.model("Board", BoardSchema);