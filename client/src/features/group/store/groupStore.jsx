import React, {createContext, useContext, useMemo, useState} from "react";

const GroupsContext = createContext(null);

export function GroupsProvider({children}) {
    const [currentUser] = useState({id: "u1", email: "me@uni.edu", name: "You"});

    const [groups, setGroups] = useState([
        {
            id: "g1",
            name: "Projekt Bazy Danych",
            description: "Zespół semestralny",
            adminId: "u1",
            members: [
                {id: "u1", email: "me@uni.edu", name: "You"},
                {id: "u2", email: "ada@uni.edu", name: "Ada"}
            ],
            invites: [{id: "i1", email: "tomek@uni.edu", status: "pending"}],
            shared: {todos: [], notes: [], events: []},
        },
    ]);

    const createGroup = ({name, description}) => {
        const newGroup = {
            id: (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
            name,
            description,
            adminId: currentUser.id,
            members: [currentUser],
            invites: [],
            shared: {todos: [], notes: [], events: []},
        };
        setGroups(prev => [newGroup, ...prev]);
        return newGroup;
    };

    const deleteGroup = (groupId) => {
        setGroups(prev => prev.filter(g => g.id !== groupId));
    };

    const inviteToGroup = (groupId, email) => {
        const inv = {
            id: (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
            email,
            status: "pending"
        };
        setGroups(prev => prev.map(g => g.id === groupId ? {...g, invites: [inv, ...g.invites]} : g));
        return inv;
    };

    const removeMember = (groupId, userId) => {
        setGroups(prev => prev.map(g => g.id === groupId ? {
            ...g,
            members: g.members.filter(m => m.id !== userId)
        } : g));
    };

    const acceptInviteForEmail = (groupId, email) => {
        setGroups(prev => prev.map(g => {
            if (g.id !== groupId) return g;
            const inv = g.invites.find(i => i.email === email && i.status === "pending");
            if (!inv) return g;
            const newUser = {
                id: (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
                email,
                name: email.split("@")[0]
            };
            return {
                ...g,
                members: [...g.members, newUser],
                invites: g.invites.map(i => i.id === inv.id ? {...i, status: "accepted"} : i),
            };
        }));
    };

    const value = useMemo(() => ({
        currentUser, groups, createGroup, deleteGroup, inviteToGroup, removeMember, acceptInviteForEmail
    }), [currentUser, groups]);

    return <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>;
}

export function useGroups() {
    const ctx = useContext(GroupsContext);
    if (!ctx) throw new Error("useGroups must be used within GroupsProvider");
    return ctx;
}
