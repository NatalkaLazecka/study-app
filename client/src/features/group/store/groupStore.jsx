import { createContext, useContext, useEffect, useState } from "react";

const GroupsContext = createContext(null);
const API = import.meta.env.VITE_API_URL;

export function GroupsProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchGroups = async () => {
    const res = await fetch(`${API}/api/groups`, { headers });
    setGroups(await res.json());
  };

  const fetchGroupDetails = async (id) => {
    const res = await fetch(`${API}/api/groups/${id}`, { headers });
    const data = await res.json();
    setCurrentGroup(data);
  };

  const createGroup = async ({ name }) => {
    const res = await fetch(`${API}/api/groups`, {
      method: "POST",
      headers,
      body: JSON.stringify({ nazwa: name }),
    });
    const g = await res.json();
    await fetchGroups();
    return g;
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <GroupsContext.Provider
      value={{ groups, currentGroup, fetchGroupDetails, createGroup }}
    >
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroups() {
  return useContext(GroupsContext);
}
