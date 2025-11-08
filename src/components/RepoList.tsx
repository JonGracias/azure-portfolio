// src/components/RepoList.tsx
"use client";
import { useRef, useEffect, useState } from "react";
import RepoCard from "./RepoCard";
import { Repo } from "@/lib/types";
import MobileDetect from 'mobile-detect'; 

export default function RepoList({ repos }: { repos: Repo[] }) {
const [hoverPos, setHoverPos] = useState<{ top: number; left: number; height: number; width: number }>({ top: 0, left: 0, height: 0, width: 0 });
const [hoveredRepo, setHoveredRepo] = useState<Repo | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  // removed `context` usage
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    // run only on client
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    // MobileDetect import assumed present elsewhere in file
    const md = new MobileDetect(ua);
    setIsMobile(Boolean(md.mobile()));
  }, []);

  useEffect(() => {
    setViewportWidth(window.innerWidth);
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <section id="scroll-container"
      className="
        scroll-container
        w-full mx-auto
        overflow-y-auto overflow-x-hidden
        custom-scrollbar
        bg-gray-100 dark:bg-gray-800
        border border-gray-300 dark:border-gray-700
        sm:max-w-[27.6rem] lg:max-w-[41.1rem] xl:max-w-[54.75rem] 
        sm:max-h-[27.6rem] lg:max-h-[41.1rem] xl:max-h-[54.75rem] 
        shadow-md
        rounded-2xl
      ">
      {!isMobile && hoveredRepo && (
      <div className="
        fixed z-[1]         
        transition-transform duration-200 ease-out
        "
        style={{
          top: `${hoverPos.top + (viewportWidth > 640 ? 16 : 8)}px`,
          left: `${hoverPos.left - 0}px`,
          width: hoverPos.width,
          height: hoverPos.height,
          transform: viewportWidth < 640 ? "scale(1.1)" : "scale(1.3)",
          transition: "opacity 0.2s ease-out",
          opacity: hoveredRepo?.id === hoveredRepo?.id ? 1 : 0,
        }}
      >
        <div className="w-full sm:w-[12rem] h-auto"
          id="popup-card"
        >
        <RepoCard
          repo={hoveredRepo}
          setHoverPos={setHoverPos}
          setHoveredRepo={setHoveredRepo} 
        />
        </div>
      </div>
      )}
      <div className="
      grid gap-6
      grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
      auto-rows-[12rem]
      overflow-hidden
      relative
      isolate
      p-4">
        {repos.map((r) => (
          <div
            key={r.id}
            className={`group relative w-full sm:w-[12rem] h-[12rem] 
            ${r.id === hoveredRepo?.id && !isMobile ? "invisible" : ""}`}
          >
            <RepoCard
              repo={r}
              setHoverPos={setHoverPos}
              setHoveredRepo={setHoveredRepo}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
