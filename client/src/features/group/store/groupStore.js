import {create} from "zustand";
import {getStudentId} from "../../../utils/authService";

const API =
    import.meta.env.VITE_RAILWAY_API_URL || "http://localhost:3001";

export const useGroups = create((set) => ({
    groups: [],
    currentGroup: null,

    fetchGroups: async () => {
        try {
            const studentId = getStudentId();
            if (!studentId) {
                set({groups: []});
                return;
            }

            const res = await fetch(`${API}/api/groups/student/${studentId}`);
            if (!res.ok) {
                set({groups: []});
                return;
            }

            const data = await res.json();
            set({groups: Array.isArray(data) ? data : []});
        } catch (err) {
            console.error("fetchGroups error:", err);
            set({groups: []});
        }
    },

    fetchGroupDetails: async (groupId) => {
        try {
            const res = await fetch(`${API}/api/groups/${groupId}`);
            if (!res.ok) return;

            const data = await res.json();

            set({
                currentGroup: {
                    ...data,
                    members: Array.isArray(data.members) ? data.members : [],
                },
            });
        } catch (err) {
            console.error("fetchGroupDetails error:", err);
        }
    },

    clearCurrentGroup: () => set({currentGroup: null}),

    createGroup: async ({name}) => {
        try {
            const studentId = getStudentId();
            if (!studentId) return null;

            const res = await fetch(
                `${API}/api/groups/student/${studentId}`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({nazwa: name}),
                }
            );

            if (!res.ok) return null;

            const group = await res.json();

            set((state) => ({
                groups: [...state.groups, group],
            }));

            return group;
        } catch (err) {
            console.error("createGroup error:", err);
            return null;
        }
    },
}));
