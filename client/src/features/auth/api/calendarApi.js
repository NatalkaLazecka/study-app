import { apiFetch } from "./apiClient";

export async function getStudentEvents() {
  const res = await apiFetch(`/api/events/student`);
  console.log("calendarApi getStudentEvents: ", res);
  return res.json();
}

export async function getTodaySchedule() {
  const res = await apiFetch(`/api/schedule/today`);
  return res.json();
}
