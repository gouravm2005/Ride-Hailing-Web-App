import NotificationPopup from "../components/NotificationPopup";
import { Outlet } from "react-router-dom";

export default function CaptainLayout() {
  return (
    <>
      <NotificationPopup role="captain" />
      <Outlet />
    </>
  );
}