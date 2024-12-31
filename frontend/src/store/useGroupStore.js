import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useGroupStore = create((set, get) => ({
  groups: [],
  groupMessages: [],
  selectedGroup: null,
  members: [],
  admin: null,
  isGroupsLoading: false,
  isMessagesLoading: false,
  isMembersLoading: false,

  getMyGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups/my-groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  getGroupMessages: async (groupId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groups/${groupId}`);
      set({ groupMessages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessageInGroup: async (groupId, messageData) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.post(
        `/groups/send/${groupId}`,
        messageData
      );
      set({ groupMessages: [...get().groupMessages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  createGroup: async (groupData) => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.post("/groups/create", groupData);
      set({ groups: [...get().groups, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  deleteGroup: async (groupId) => {
    set({ isGroupsLoading: true });
    try {
      await axiosInstance.delete(`/groups/delete/${groupId}`);
      const updatedGroups = get().groups.filter(
        (group) => group._id !== groupId
      );
      set({ groups: updatedGroups });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  addMember: async (groupId, userId) => {
    set({ isMembersLoading: true });
    try {
      await axiosInstance.put(`/groups/${groupId}/members`, {
        memberId: userId,
      });
      set({ members: [...get().members, { _id: userId }] });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMembersLoading: false });
    }
  },

  setSelectedGroup: (group) => set({ selectedGroup: group }),
}));
