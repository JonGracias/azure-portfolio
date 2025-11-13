"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Repo } from "@/lib/types";
import { fetchRepos } from "@/lib/github";

interface RepoContextType {
  starred: Record<string, boolean>;
  setStarred: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isLoaded: boolean;
  count: Record<string, number>;
  setCount: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  hoveredRepo: Repo | null;
  setHoveredRepo: React.Dispatch<React.SetStateAction<Repo | null>>;
  refreshStars: () => Promise<void>;
  repos: Repo[];
}

const RepoContext = createContext<RepoContextType | undefined>(undefined);

export function RepoProvider({ repos, children }: { repos: Repo[]; children: ReactNode }) {
  const [starred, setStarred] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [count, setCount] = useState<Record<string, number>>({});
  const [hoveredRepo, setHoveredRepo] = useState<Repo | null>(null);
  

  // Get Star Counts
  useEffect(() => {
    function refresh() {
      const newCounts = { ...count };
      for (const r of repos) {
        newCounts[r.name] = r.stargazers_count;
      }
      setCount(newCounts);
    }

    refresh();
  }, []);

  // Get User Starred Repos
  async function refreshStars() {
    try {
        const res = await fetch("/api/github/starred-list", { cache: "no-store" });
        const data = await res.json();

        if (data.authed && Array.isArray(data.repos)) {
        const starredMap: Record<string, boolean> = {};

        for (const r of data.repos) {
            if (r.name) {
            starredMap[r.name] = true;
          }
        }

        setStarred(starredMap);
        }
    } catch (err) {
        console.error("refreshStars failed:", err);
    } finally {
        setIsLoaded(true);
    }
  }

  useEffect(() => {
  refreshStars();
  }, []);

    return (
      <RepoContext.Provider
        value={{
          starred,
          setStarred,
          isLoaded,
          count,
          setCount,
          hoveredRepo,
          setHoveredRepo,
          refreshStars,
          repos,
        }}
      >
        {children}
      </RepoContext.Provider>
    );
  }

  export function useRepoContext() {
    const context = useContext(RepoContext);
    if (!context) throw new Error("useRepoContext must be used within a RepoProvider");
    return context;
}
