import { apiFetch } from "./apiClient";

// ===== CATEGORIES =====
export async function getEventCategories() {
  const res = await apiFetch("/api/events/categories");
  return res.json();
}

// ===== FILES =====
export async function getEventFiles(eventId) {
  const res = await apiFetch(`/api/events/${eventId}/files`);
  return res.json();
}

export async function uploadEventFile(eventId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/events/${eventId}/files`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Upload failed");
}

export async function deleteEventFile(fileId) {
  await apiFetch(`/api/events/files/${fileId}`, { method: "DELETE" });
}

export async function downloadEventFile(fileId) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/events/files/${fileId}/download`
  );
  if (!res.ok) throw new Error("Download failed");
  return res.blob();
}

// ===== EVENTS =====
export async function createEvent(data) {
  await apiFetch("/api/events", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEvent(id, data) {
  await apiFetch(`/api/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(id) {
  await apiFetch(`/api/events/${id}`, { method: "DELETE" });
}
