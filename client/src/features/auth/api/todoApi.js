import {apiFetch} from "./apiClient";

export const STATUS_ON_GOING = "a0b9c93d-e4d0-11f0-b846-42010a400016";
export const STATUS_DONE = "a17535d5-e4d0-11f0-b846-42010a400016";

export async function getTasksByStudent(studentId) {
    const res = await apiFetch(`/api/tasks/student/${studentId}`);
    return await res.json();
}


export async function updateTask(taskId, payload) {
    const res = await apiFetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return await res.json();
}


export async function deleteTask(taskId, studentId) {
    const res = await apiFetch(`/api/tasks/${taskId}?studentId=${studentId}`, {
        method: "DELETE",
    });
    return await res.json();
}


export async function getTaskById(taskId, studentId) {
    const res = await apiFetch(`/api/tasks/${taskId}?studentId=${studentId}`);
    return res;
}

export async function createTask(payload) {
    const res = await apiFetch(`/api/tasks`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return await res.json();
}

