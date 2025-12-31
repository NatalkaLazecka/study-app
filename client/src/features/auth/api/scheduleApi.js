import { apiFetch } from "./apiClient";

export async function getStudentSchedule(studentId) {
  const res = await apiFetch(`/api/schedule/student/${studentId}`);
  return res.json();
}

export async function createSchedule(data) {
  await apiFetch("/api/schedule", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSchedule(id, data) {
  await apiFetch(`/api/schedule/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSchedule(id) {
  await apiFetch(`/api/schedule/${id}`, { method: "DELETE" });
}

export async function getSubjects() {
  const res = await apiFetch("/api/schedule/subjects");
  return res.json();
}

export async function createSubject(name) {
  const res = await apiFetch("/api/schedule/subject", {
    method: "POST",
    body: JSON.stringify({ nazwa: name }),
  });
  return res.json();
}

export async function updateSubject(id, name) {
  const res = await apiFetch(`/api/schedule/subject/${id}`, {
    method: "PUT",
    body: JSON.stringify({ nazwa: name }),
  });
  return res.json();
}

export async function deleteSubject(id) {
  await apiFetch(`/api/schedule/subject/${id}`, { method: "DELETE" });
}

export async function getProfessors() {
  const res = await apiFetch("/api/schedule/professors");
  return res.json();
}

export async function createProfessor(imie, nazwisko) {
  const res = await apiFetch("/api/schedule/professor", {
    method: "POST",
    body: JSON.stringify({ imie, nazwisko }),
  });
  return res.json();
}

export async function updateProfessor(id, imie, nazwisko) {
  const res = await apiFetch(`/api/schedule/professor/${id}`, {
    method: "PUT",
    body: JSON.stringify({ imie, nazwisko }),
  });
  return res.json();
}

export async function deleteProfessor(id) {
  await apiFetch(`/api/schedule/professor/${id}`, { method: "DELETE" });
}

export async function clearStudentSchedule(studentId) {
  await apiFetch(`/api/schedule/student/${studentId}/all`, {
    method: "DELETE",
  });
}

export async function toggleFullWeekSchedule(studentId){
  await fetch(`/api/students/${studentId}/updateFullWeek`, {
    method: "PUT",
    body: JSON.stringify({ student_id: studentId }),
    headers: { "Content-Type": "application/json" }
  })
}

export async function getStudentWeekType(studentId){
  const res = await fetch(`/api/students/${studentId}/getTypeForWeek`);
  const data = await res.json();
  return Boolean(Number(data.full_week_schedule));
}