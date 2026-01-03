import {apiFetch} from "./apiClient";

export async function getMyGroups() {
    const res = await apiFetch("/api/groups");
    return res.json();
}

export async function getGroupById(groupId) {
    const res = await apiFetch(`/api/groups/${groupId}`);
    return res.json();
}

export async function createGroup(name) {
    const res = await apiFetch("/api/groups", {
        method: "POST",
        body: JSON.stringify({nazwa: name}),
    });
    return res.json();
}

export async function addMemberToGroup(groupId, email) {
    const res = await apiFetch(`/api/groups/${groupId}/add-user`, {
        method: "POST",
        body: JSON.stringify({email}),
    });
    return res.json();
}

export async function removeMemberFromGroup(groupId, memberId) {
    const res = await apiFetch(`/api/groups/${groupId}/members/${memberId}`, {
        method: "DELETE",
    });
    return res.json();
}

export async function leaveGroup(groupId) {
    const res = await apiFetch(`/api/groups/${groupId}/leave`, {
        method: "POST",
    });
    return res.json();
}

export async function transferAdminRights(groupId, newAdminId) {
    const res = await apiFetch(`/api/groups/${groupId}/transfer-admin`, {
        method: "PUT",
        body: JSON.stringify({newAdminId}),
    });
    return res.json();
}

export async function deleteGroup(groupId) {
    const res = await apiFetch(`/api/groups/${groupId}`, {
        method: "DELETE",
    });
    return res.json();
}

