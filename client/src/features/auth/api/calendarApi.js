import { apiFetch } from "./apiClient";

export async function getStudentEvents() {
  const res = await apiFetch(`/api/events/student`);
  return res.json();
}

export async function getTodaySchedule() {
  const res = await apiFetch(`/api/schedule/student/today`);
  return res.json();
}
