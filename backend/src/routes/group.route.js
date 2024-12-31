import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addMemberToGroup,
  createGroup,
  deleteGroup,
  getGroupById,
  getMessagesInGroup,
  getMyGroups,
  sendMessageInGroup,
} from "../controllers/group.controller.js";

const router = express.Router();

router.get("/my-groups", protectRoute, getMyGroups);
router.get("/:id", protectRoute, getGroupById);
router.get("/:id/messages", protectRoute, getMessagesInGroup);

router.post("/send/:id", protectRoute, sendMessageInGroup);
router.post("/create", protectRoute, createGroup);

router.put("/:id/members", protectRoute, addMemberToGroup);

router.delete("/delete/:id", protectRoute, deleteGroup);

export default router;
