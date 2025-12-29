import { apiFetch } from "./apiClient";

export async function getStudentEvents(studentId) {
  const res = await apiFetch(`/api/events/student/${studentId}`);
  return res.json();
}

export async function getTodaySchedule(studentId) {
  const res = await apiFetch(`/api/schedule/student/${studentId}/today`);
  return res.json();
}
