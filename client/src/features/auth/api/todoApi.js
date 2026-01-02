import {apiFetch} from "./apiClient";

export const STATUS_ON_GOING = "a0b9c93d-e4d0-11f0-b846-42010a400016";
export const STATUS_DONE = "a17535d5-e4d0-11f0-b846-42010a400016";

export async function getMyTasks() {
    const res = await apiFetch(`/api/tasks/`);
    console.log("todoApi getMyTasks: ", res);
    return await res.json();
}


export async function updateTask(taskId, payload) {
    const res = await apiFetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
    return await res.json();
}


export async function deleteTask(taskId) {
    const res = await apiFetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
    });
    return await res.json();
}


export async function getTaskById(taskId) {
  const res = await apiFetch(`/api/tasks/${taskId}`);
  const data = await res.json();


  if (Array.isArray(data?.result)) {
    return data.result[0];
  }

  return data;
}

export async function createTask(payload) {
    const res = await apiFetch(`/api/tasks`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return await res.json();
}

