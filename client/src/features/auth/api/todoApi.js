import {apiFetch} from "./apiClient";

export const STATUS_ON_GOING = "a0b9c93d-e4d0-11f0-b846-42010a400016";
export const STATUS_DONE = "a17535d5-e4d0-11f0-b846-42010a400016";

export async function getTasksByStudent(studentId) {
    const res = await apiFetch(`/api/tasks/student/${studentId}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}


export function updateTask(taskId, payload) {
    return apiFetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export function deleteTask(taskId, studentId) {
    return apiFetch(`/api/tasks/${taskId}?studentId=${studentId}`, {
        method: "DELETE",
    });
}

export async function getTaskById(taskId, studentId) {
    const res = await apiFetch(`/api/tasks/${taskId}?studentId=${studentId}`);
    return res.json();
}

export function createTask(payload) {
    return apiFetch(`/api/tasks`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
