import { apiFetch } from "./apiClient";

export async function getNotifications() {
  const res = await apiFetch("/api/notifications");
  return res.json();
}

export async function markAllAsRead() {
  await apiFetch("/api/notifications/mark-all-read", {
    method: "POST",
  });
}

export async function markAsRead(id, type) {
  await apiFetch("/api/notifications/mark-read", {
    method: "POST",
    body: JSON.stringify({ id, type }),
  });
}

export async function deleteNotification(id, type) {
  await apiFetch("/api/notifications/delete", {
    method: "DELETE",
    body: JSON.stringify({ id, type }),
  });
}
