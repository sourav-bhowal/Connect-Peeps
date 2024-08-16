import { Metadata } from "next";
import MyBookmarks from "./Bookmarks";
import TrendsSideBar from "@/components/shared/TrendsSideBar";

// Set Metadata
export const metadata: Metadata = {
  title: "Bookmarks",
};

// Page Content
export default function Bookmarks() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
        </div>
        {/* My Bookmarks */}
        <MyBookmarks />
      </div>
      {/* Trends Side Bar */}
      <TrendsSideBar />
    </main>
  );
}
