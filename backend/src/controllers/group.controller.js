import cloudinary from "../lib/cloudinary.js";
import Group from "../models/group.model.js";
import Message from "../models/message.model.js";

export const getMyGroups = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const groups = await Group.find({
      $or: [{ admin: loggedInUserId }, { members: loggedInUserId }],
    }).select("-members");
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getMyMyGroups " + error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const group = await Group.findById(groupId)
      .populate({
        path: "members",
        select: "_id fullName profilePic",
      })
      .populate({
        path: "admin",
        select: "_id fullName profilePic",
      });
    res.status(200).json(group);
  } catch (error) {
    console.error("Error in getGroupById " + error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMessagesInGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const messages = await Message.find({ group: groupId });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessagesInGroup controller: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const sendMessageInGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      group: groupId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    // todo: real-time messaging => socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessageInGroup " + error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { name, avatar, member } = req.body;
    const admin = req.user._id;
    const newGroup = new Group({
      name,
      avatar,
      admin,
      members: Array.from(new Set([admin, ...(member ? [member] : [])])),
    });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error in createGroup " + error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    await Group.findByIdAndDelete(groupId);
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error in deleteGroup " + error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addMemberToGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { memberId } = req.body;
    await Group.findByIdAndUpdate(groupId, {
      $push: { members: memberId },
    });
    res.status(200).json({ message: "Member added successfully" });
  } catch (error) {
    console.error("Error in addMemberToGroup " + error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
