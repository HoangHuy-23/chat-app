import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
