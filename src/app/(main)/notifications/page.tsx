import { Metadata } from "next";
import TrendsSideBar from "@/components/shared/TrendsSideBar";
import MyNotifications from "./Notifications";

// Set Metadata
export const metadata: Metadata = {
  title: "Notifications",
};

// Page Content
export default function Notifications() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Notifications</h1>
        </div>
        {/* My Bookmarks */}
        <MyNotifications />
      </div>
      {/* Trends Side Bar */}
      <TrendsSideBar />
    </main>
  );
}
