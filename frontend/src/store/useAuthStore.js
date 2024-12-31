import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });

      get().connectSocket();
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", formData);
      toast.success("Account created successfully");
      set({ authUser: response.data });

      get().connectSocket();
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (formData) => {
    set({ isLoggingIng: true });
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      toast.success("Logged in successfully");
      set({ authUser: response.data });

      get().connectSocket();
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIng: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      toast.success("Logged out successfully");
      set({ authUser: null });

      get().disconnectSocket();
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: response.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (data) => {
      set({ onlineUsers: data });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));
