import {apiFetch} from "./apiClient";

export async function getMyGroups() {
    const res = await apiFetch("/api/groups");
    return res.json();
}

export async function getGroupById(groupId) {
    const res = await apiFetch(`/api/groups/${groupId}`);
    return res.json();
}

export async function getGroupCategories() {
    const res = await apiFetch("/api/groups/categories");
    return res.json();
}

export async function createGroup(name, categoryId) {
    const res = await apiFetch("/api/groups", {
        method: "POST",
        body: JSON.stringify({nazwa: name.trim(), kategoria_grupa_id: categoryId}),
    });
    return res.json();
}

export async function addMemberToGroup(groupId, email) {
    try {
        const res = await apiFetch(`/api/groups/${groupId}/add-user`, {
            method: "POST",
            body: JSON.stringify({email}),
        });

        if (!res.ok) {
            let errorMessage = `HTTP ${res.status}`;

            try {
                const errorData = await res.json();
                console.error('[groupApi] Error data:', errorData);
                errorMessage = errorData.message || errorMessage;
            } catch (parseErr) {
                console.error('[groupApi] Failed to parse error:', parseErr);
            }

            throw new Error(errorMessage);
        }

        return await res.json();
    } catch (err) {
        console.error('[groupApi] Exception:', err);
        throw err;
    }
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

export async function deleteGroup(groupId) {
    const res = await apiFetch(`/api/groups/${groupId}`, {
        method: "DELETE",
    });
    return res.json();
}

export async function getGroupNotes(groupId) {
    const res = await apiFetch(`/api/groups/${groupId}/notes`);
    return res.json();
}

export async function createGroupNote(groupId, data) {
    const res = await apiFetch(`/api/groups/${groupId}/notes`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteGroupNote(groupId, noteId) {
    const res = await apiFetch(`/api/groups/${groupId}/notes/${noteId}`, {
        method: "DELETE",
    });
    return res.json();
}

export async function getGroupAnnouncements(groupId) {
    const res = await apiFetch(`/api/groups/${groupId}/announcements`);
    return res.json();
}

export async function getNoteFiles(noteId) {
    return fetch(`/api/groups/${noteId}/files`).then(res => res.json());
}
export async function uploadNoteFile(noteId, file) {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`/api/groups/${noteId}/file`, {
        method: 'POST',
        body: formData,
    }).then(res => res.json());
}
export async function downloadNoteFile(fileId) {
    return fetch(`/api/groups/${fileId}/download`).then(res => res.blob());
}
export async function deleteNoteFile(fileId) {
    return fetch(`/api/groups/${fileId}`, { method: 'DELETE' });
}