import { create } from "zustand";
import { getStudentId } from "../../../utils/auth";

const API =
  import.meta.env.VITE_RAILWAY_API_URL || "http://localhost:3001";

export const useGroups = create((set) => ({
  groups: [],
  currentGroup: null,

  fetchGroups: async () => {
    try {
      const studentId = getStudentId();
      if (!studentId) {
        console.warn("No studentId in localStorage");
        set({ groups: [] });
        return;
      }

      const res = await fetch(
        `${API}/api/groups/student/${studentId}`
      );

      if (!res.ok) {
        console.error("fetchGroups HTTP error:", res.status);
        set({ groups: [] });
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("fetchGroups: expected array, got:", data);
        set({ groups: [] });
        return;
      }

      set({ groups: data });
    } catch (err) {
      console.error("fetchGroups error:", err);
      set({ groups: [] });
    }
  },

fetchGroupDetails: async (groupId) => {
  try {
    const res = await fetch(`${API}/api/groups/${groupId}`);

    if (!res.ok) {
      console.error("fetchGroupDetails HTTP error:", res.status);
      set({ currentGroup: null });
      return;
    }

    const data = await res.json();

    if (!data || !data.id) {
      set({ currentGroup: null });
      return;
    }

    set({ currentGroup: data });
  } catch (err) {
    console.error("fetchGroupDetails error:", err);
    set({ currentGroup: null });
  }
},



  createGroup: async ({ name }) => {
    const studentId = getStudentId();
    if (!studentId) return null;

    const res = await fetch(
      `${API}/api/groups/student/${studentId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nazwa: name }),
      }
    );

    if (!res.ok) {
      console.error("createGroup failed:", res.status);
      return null;
    }

    const group = await res.json();

    set((state) => ({
      groups: [...state.groups, group],
    }));

    return group;
  },
}));
