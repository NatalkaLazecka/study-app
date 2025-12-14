import { create } from "zustand";
import { getStudentId } from "../../../utils/auth";

const API_URL = import.meta.env.VITE_RAILWAY_API_URL || "http://localhost:3001";

export const useGroups = create((set) => ({
  groups: [],
  currentGroup: null,

  fetchGroups: async () => {
    const studentId = getStudentId();
    if (!studentId) return;

    const res = await fetch(`${API_URL}/api/groups/student/${studentId}`);
    const data = await res.json();

    set({ groups: Array.isArray(data) ? data : [] });
  },

  fetchGroupDetails: async (groupId) => {
    const res = await fetch(`${API_URL}/api/groups/${groupId}`);
    const data = await res.json();
    set({ currentGroup: data });
  },

  createGroup: async ({ name }) => {
    const studentId = getStudentId();

    const res = await fetch(`${API_URL}/api/groups/student/${studentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nazwa: name }),
    });

    const group = await res.json();

    set((state) => ({
      groups: [...state.groups, group],
    }));

    return group;
  },
}));
