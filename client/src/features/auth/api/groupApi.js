import { apiFetch } from "./apiClient";

export async function getMyGroups() {
    const res = await apiFetch("/api/groups");
    return res.json();
}

export async function getGroupById(groupId) {
    const res = await apiFetch(`/api/groups/${groupId}`);
    return res.json();
}

// export async function createGroup(name) {
//     const res = await apiFetch("/api/groups", {
//         method: "POST",
//         body: JSON.stringify({ nazwa: name.trim() }),
//     });
//     return res.json();
// }

export async function createGroup(name) {
  console.log('📤 [groupApi] createGroup called:', { name, type: typeof name });

  // ✅ WALIDACJA NA FRONTENDZIE
  if (!name || typeof name !== 'string') {
    throw new Error('Group name must be a non-empty string');
  }

  const safeName = name.trim();

  if (! safeName) {
    throw new Error('Group name cannot be empty');
  }

  console.log('📤 [groupApi] Sending request:', { nazwa: safeName });

  try {
    const res = await apiFetch("/api/groups", {
      method: "POST",
      body: JSON. stringify({ nazwa: safeName }),
    });

    console.log('📥 [groupApi] Response status:', res.status);

    if (! res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ [groupApi] Error response:', errorData);

      // Propaguj dokładny komunikat z backendu
      throw new Error(errorData.message || `HTTP ${res.status}`);
    }

    const data = await res. json();
    console.log('✅ [groupApi] Success:', data);

    return data;
  } catch (err) {
    console.error('❌ [groupApi] Exception:', err);
    throw err;
  }
}

// export async function addMemberToGroup(groupId, email) {
//     const res = await apiFetch(`/api/groups/${groupId}/add-user`, {
//         method: "POST",
//         body: JSON.stringify({email}),
//     });
//     return res.json();
// }

export async function addMemberToGroup(groupId, email) {
  console.log('📤 [groupApi] addMemberToGroup:', { groupId, email });

  try {
    const res = await apiFetch(`/api/groups/${groupId}/add-user`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    console.log('📥 [groupApi] Response status:', res.status);

    if (!res.ok) {
      // ✅ POPRAWIONE PARSOWANIE BŁĘDÓW
      let errorMessage = `HTTP ${res.status}`;

      try {
        const errorData = await res.json();
        console.error('❌ [groupApi] Error data:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (parseErr) {
        console.error('❌ [groupApi] Failed to parse error:', parseErr);
      }

      throw new Error(errorMessage);
    }

    const data = await res.json();
    console.log('✅ [groupApi] Member added successfully');

    return data;
  } catch (err) {
    console.error('❌ [groupApi] Exception:', err);
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