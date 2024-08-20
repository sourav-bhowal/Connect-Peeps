import TrendsSideBar from "@/components/shared/TrendsSideBar";
import { Metadata } from "next";
import SearchResults from "./SearchResults";

// PROPS
interface SearchProps {
  searchParams: {
    query: string;
  };
}

// Metadata
export function generateMetadata({
  searchParams: { query },
}: SearchProps): Metadata {
  return {
    title: `Search Results for ${query}`,
  };
}

// PAGE
export default function SearchPage({ searchParams: { query } }: SearchProps) {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold line-clamp-2 break-all">
            Search Results for &quot;{query}&quot;
          </h1>
        </div>
        {/* Search Results */}
        <SearchResults query={query} />
      </div>
      {/* Trends Side Bar */}
      <TrendsSideBar />
    </main>
  );
}
