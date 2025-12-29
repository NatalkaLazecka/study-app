import { apiFetch } from "./apiClient";

export async function getNotifications(studentId) {
  const res = await apiFetch(`/api/notifications?student_id=${studentId}`);
  return res.json();
}

export async function markAllAsRead(studentId) {
  await apiFetch("/api/notifications/mark-all-read", {
    method: "POST",
    body: JSON.stringify({ student_id: studentId }),
  });
}

export async function markAsRead(id, type, studentId) {
  await apiFetch("/api/notifications/mark-read", {
    method: "POST",
    body: JSON.stringify({ id, type, student_id: studentId }),
  });
}

export async function deleteNotification(id, type, studentId) {
  await apiFetch("/api/notifications/delete", {
    method: "DELETE",
    body: JSON.stringify({ id, type, student_id: studentId }),
  });
}
