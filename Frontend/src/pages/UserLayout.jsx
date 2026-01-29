import NotificationPopup from "../components/NotificationPopup";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <>
      <NotificationPopup role="user" />
      <Outlet />
    </>
  );
}