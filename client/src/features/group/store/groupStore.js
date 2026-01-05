import {create} from "zustand";
import {
    getMyGroups,
    getGroupById,
    createGroup as createGroupApi,
} from "../../auth/api/groupApi";

export const useGroups = create((set) => ({
    groups: [],
    currentGroup: null,
    loading: false,

    fetchGroups: async () => {
        set({loading: true});
        try {
            const data = await getMyGroups();
            set({groups: data || []});
        } catch (err) {
            console.error(err);
            set({groups: []});
        } finally {
            set({loading: false});
        }
    },

    fetchGroupDetails: async (groupId) => {
        try {
            const data = await getGroupById(groupId);
            set({currentGroup: data});
        } catch (err) {
            console.error(err);
        }
    },

    createGroup: async (name) => {
        console.log('🌟 [groupStore] createGroup action called with name:', name);
        const group = await createGroupApi(name);
        set((state) => ({groups: [...state.groups, group]}));
        return group;
    },

    clearCurrentGroup: () => set({currentGroup: null}),
}));
