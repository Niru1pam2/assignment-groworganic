import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full max-w-6xl mx-auto p-4">
      <Outlet />
    </div>
  );
}
