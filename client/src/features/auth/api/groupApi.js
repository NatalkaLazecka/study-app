import { apiFetch } from "./apiClient";

export async function getMyGroups() {
  const res = await apiFetch("/api/groups/my");
  return res.json();
}

export async function getGroupById(groupId) {
  const res = await apiFetch(`/api/groups/${groupId}`);
  return res.json();
}

export async function createGroup(name) {
  const res = await apiFetch("/api/groups", {
    method: "POST",
    body: JSON.stringify({ nazwa: name }),
  });
  return res.json();
}
