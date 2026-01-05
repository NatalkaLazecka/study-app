import {create} from "zustand";
import {
    getMyGroups,
    getGroupById,
    createGroup,
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

    // createGroup: async (name) => {
    //     const group = await createGroup(name);
    //     set((state) => ({groups: [...state.groups, group]}));
    //     return group;
    // },

    createGroup: async (name) => {
        console.log('📝 [groupStore] createGroup:', name);

        // ✅ WALIDACJA
        if (!name || typeof name !== 'string') {
            console.error('❌ [groupStore] Invalid name:', typeof name, name);
            throw new Error('Group name must be a string');
        }

        try {
            const group = await createGroupApi(name. trim());
            console.log('✅ [groupStore] Group created:', group);

            // Odśwież listę grup
            await get().fetchGroups();

            return group;
        } catch (err) {
            console. error('❌ [groupStore] createGroup error:', err);
            throw err;
        }
    },

    clearCurrentGroup: () => set({currentGroup: null}),
}));
