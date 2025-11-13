"use client";
import { useRef, useEffect, useState, useMemo } from "react";
import { useRepoContext } from "@/context/RepoContext";
import RepoCard from "./RepoCard";
import { Repo } from "@/lib/types";

export default function RepoList() {
  const [hoverPos, setHoverPos] = useState<{ top: number; left: number; height: number; width: number }>({ top: 0, left: 0, height: 0, width: 0 });
  const [scrolling, setScrolling] = useState(false);
  const hoveredRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    hoveredRepo,
    setHoveredRepo,
    repos
  } = useRepoContext();


  // Filters and sorting
  const [filters, setFilters] = useState({
    language: "All",
    sortBy: "activity", // "created" | "stars" | "activity" | "updated"
  });

  // Get available languages dynamically
  const languages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach(r => r.language && langs.add(r.language));
    return ["All", ...Array.from(langs).sort((a, b) => a.localeCompare(b))];
  }, [repos]);

  // Compute filtered + sorted list
  const visibleRepos = useMemo(() => {
    let list = [...repos];

    // Filter by language
    if (filters.language !== "All") {
      list = list.filter(r =>
        // If the repo has a full language map, check it
        (r.languages && Object.keys(r.languages).includes(filters.language)) ||
        // Otherwise fall back to the primary language
        r.language === filters.language
      );
    }

    // Sorting options
    list.sort((a, b) => {
      switch (filters.sortBy) {
        case "created":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "stars":
          return (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0);
        case "activity":
          return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
        case "updated":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default:
          return 0;
      }
    });

    return list;
  }, [repos, filters]);

  // Hover
  function handleMouseEnter(el: HTMLDivElement, repo: Repo) {
    hoveredRef.current = el;
    setHoveredRepo(repo);

    const rect = el.getBoundingClientRect();
    const containerRect = scrollContainerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    const containerRectBottom = containerRect.top + containerRect.height;
    const rectBottom = rect.top + rect.height;

    let topPos = rect.top < containerRect.top ? containerRect.top + 10 : rect.top;
    topPos = rectBottom > containerRectBottom ? containerRectBottom + 20 - rect.height : topPos;

    setHoverPos({ top: topPos, left: rect.left, width: rect.width, height: rect.height });
  }

  function handleMouseLeave() {
    hoveredRef.current = null;
    setHoveredRepo(null);
  }

  // Scroll Listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      setScrolling(true);
      clearTimeout(scrollTimeout);
      setHoveredRepo(null);
      scrollTimeout = setTimeout(() => setScrolling(false), 150);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Resize
  useEffect(() => {
    const handleResize = () => {};
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      ref={scrollContainerRef}
      className="
        scroll-container
        w-full mx-auto
        overflow-y-auto overflow-x-hidden
        custom-scrollbar
        bg-gray-100 dark:bg-gray-800
        border border-gray-300 dark:border-gray-700
        sm:max-w-[27.6rem] lg:max-w-[41.1rem] xl:max-w-[54.75rem]
        [height:calc(100dvh-26rem)]
        shadow-md
        rounded-2xl">
      {/* Filter bar */}
      <div className="
            sticky top-0 z-10 
            bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur 
            border-b border-gray-300 dark:border-gray-700 
            px-4 py-3 rounded-t-2xl 
            flex flex-wrap items-center gap-3">

          {/* Filter */}
          <label className="text-sm font-medium">Language:</label>
          <select
            value={filters.language}
            onChange={(e) => setFilters((f) => ({ ...f, language: e.target.value }))}
            className="
              px-2 py-1 rounded-lg 
              border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900">

            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>

            ))}
          </select>

          {/* Sort */}
          <label className="ml-2 text-sm font-medium">Sort by:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
            className="px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900">

            <option value="stars">Most Stars</option>
            <option value="created">Date Created</option>
            <option value="activity">Most Activity</option>
            <option value="updated">Last Updated</option>

          </select>
      </div>

      {/* Pop-up Card */}
      {!scrolling && hoveredRepo && (
        <div
          className="fixed z-[20] transition-transform duration-200 ease-out hidden sm:block"
          style={{
            top: `${hoverPos.top}px`,
            left: `${hoverPos.left - 16}px`,
            width: hoverPos.width,
            height: hoverPos.height,
            transform: "scale(1.1)",
            }}>

          <div className="w-full sm:w-[12rem] h-auto" id="popup-card" onMouseLeave={handleMouseLeave}>
            <RepoCard repo={hoveredRepo}/>
          </div>
        </div>
      )}

      {/* Grid */}
      <div
        className="
          grid gap-10
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          auto-rows-[12rem]
          overflow-hidden
          relative
          isolate
          p-8 pt-3
        "
      >
        {visibleRepos.map((repo) => (
          <div key={repo.id} className="relative w-full sm:w-[12rem] h-auto">
            <div onMouseEnter={(e) => handleMouseEnter(e.currentTarget, repo)}>
              <div className="pointer-events-none">
                <RepoCard repo={repo}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
