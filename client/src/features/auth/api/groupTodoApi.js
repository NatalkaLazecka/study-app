import {apiFetch} from "./apiClient";

export const STATUS_ON_GOING = "a0b9c93d-e4d0-11f0-b846-42010a400016";
export const STATUS_DONE = "a17535d5-e4d0-11f0-b846-42010a400016";

export async function getGroupTasks(groupId) {
    const res = await apiFetch(`/api/tasks/group/${groupId}`);
    return res.json();
}
export async function createGroupTask(groupId, task) {
    const res = await apiFetch(`/api/tasks/group/${groupId}`, {
        method: "POST",
        body: JSON.stringify(task),
    });
    return res.json();
}
export async function updateGroupTask(groupId, taskId, task) {
    const res = await apiFetch(`/api/tasks/group/${groupId}/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(task),
    });
    return res.json();
}
export async function toggleGroupTask(groupId, taskId) {
    const res = await apiFetch(`/api/tasks/group/${groupId}/${taskId}/toggle`, {
        method: "PATCH"
    });
    return res.json();
}
export async function deleteGroupTask(groupId, taskId) {
    await apiFetch(`/api/tasks/group/${groupId}/${taskId}`, {
        method: "DELETE"
    });
}