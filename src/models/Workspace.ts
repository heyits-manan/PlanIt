import mongoose from "mongoose";

// Define the schema for a Board
const BoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cards: {
      type: [String], // Array of card IDs
      default: [],
    },
    position: {
      type: Number,
      required: true, // Used for ordering
    },
  },
  { timestamps: true }
);

// Define the schema for a Workspace
const WorkspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: String, // Store Clerk's user ID as a string
      required: true,
    },
    members: {
      type: [String], // Array of User IDs for workspace members
      default: [],
    },
    boards: {
      type: [BoardSchema], // Embed boards within the workspace
      default: [],
    },
  },
  { timestamps: true }
);

// Check if the model already exists before defining it
const Workspace =
  mongoose.models.Workspace || mongoose.model("Workspace", WorkspaceSchema);

export { Workspace };
