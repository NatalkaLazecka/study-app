import { apiFetch } from "./apiClient";

export async function getStudentEvents(studentId) {
  const res = await apiFetch(`/api/events/student`);
  return res.json();
}

export async function getTodaySchedule(studentId) {
  const res = await apiFetch(`/api/schedule/student/today`);
  return res.json();
}
