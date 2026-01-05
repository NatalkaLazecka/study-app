import { useState } from "react";
import { Outlet } from "react-router-dom";
import MenuBar from "@/components/MenuBar";
import LogoutModal from "@/components/LogoutModal";

export default function AppLayout() {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <MenuBar onLogoutClick={() => setShowLogout(true)} />

      <Outlet />

      {showLogout && (
        <LogoutModal onClose={() => setShowLogout(false)} />
      )}
    </>
  );
}
