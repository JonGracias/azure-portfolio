// src/components/RepoCard.tsx
"use client";
import { useState, useEffect, useRef, JSX } from "react";
import {  useFloating, size, autoUpdate  } from "@floating-ui/react";
import { Repo } from "@/lib/types";

export default function RepoCard(
  { referenceRef, repo }: 
  { referenceRef: React.RefObject<HTMLDivElement>; repo: Repo }): JSX.Element {
  
  const [count, setCount] = useState<number>(repo.stargazers_count);
  const [starring, setStarring] = useState<boolean>(false);
  const [starred, setStarred] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const updated: string = new Date(repo.updated_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const { refs, floatingStyles } = useFloating({
    elements: { reference: referenceRef.current },
    placement: "top-start",
    strategy: "absolute", // <<< key change — same stacking context as grid
    middleware: [
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            height: `${rects.reference.height}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    async function checkStarred(): Promise<void> {
      const res = await fetch(`/api/github/starred?owner=${repo.owner}&repo=${repo.name}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.authed && data.starred) setStarred(true);
    }
    checkStarred();
  }, [repo.owner, repo.name]);

  async function handleStar(): Promise<void> {
    setStarring(true);
    try {
      const res = await fetch("/api/github/star", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner: repo.owner, repo: repo.name }),
      });
      const data = await res.json();

      if (res.status === 401) {
        window.location.href = "/api/github/login";
        return;
      }

      if (data.ok) {
        setStarred(true);
        if (typeof data.count === "number") setCount(data.count);
      }
    } finally {
      setStarring(false);
    }
  }

  async function handleUnStar(): Promise<void> {
    setShowConfirm(true);
  }

  function confirmUnstar(choice: "yes" | "no"): void {
    if (choice === "yes") {
      setMessage("😆 Not allowed!");
    }
    setShowConfirm(false);

    if (choice === "yes") {
      setTimeout(() => setMessage(null), 3000);
    }
  }

  return (
    <div 
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        zIndex: 50,
        pointerEvents: "auto", // enable pointer capture here
      }}
      className={[
        "group block w-full rounded-xl border shadow-sm",
        "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700",
        "hover:border-blue-400 focus-within:border-blue-400 active:border-blue-400",
        "transform-gpu origin-center transition-transform duration-200 ease-out",
        "group-active:scale-105 focus-within:scale-105 group-hover:scale-105",
        "relative z-0 md:group-hover:z-20 md:group-focus-within:z-20 md:group-hover-within:overflow-visible",
        "hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500",
        "min-h-[12rem]",
        "rounded-xl",
        "z-50",
        "transition-transform duration-200"
      ].join(" ")} 
      onClick={(e) => e.stopPropagation()}>

      {/* Main Card Content */}
      {!showConfirm && !message && (
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="h-full block" 
        >
          <div className="grid h-full grid-rows-[auto,auto,auto,auto] gap-2 p-5">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400 truncate z-10">
              {repo.name}
            </h3>
            <div className="overflow-hidden">
              <div
                className="
                  text-sm text-gray-600 dark:text-gray-300 leading-5 break-words
                  max-h-[4rem] min-h-[4rem] opacity-70
                  transition-[max-height,opacity] duration-200 ease-out
                  group-hover:max-h-40 group-hover:opacity-100
                  group-focus-within:max-h-40 group-focus-within:opacity-100
                "
              >
                {repo.description ?? "No description"}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{repo.language ?? "Unknown"}</span>
              <div>
                {!starred && (
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStar();
                    }}
                    disabled={starring || starred}
                    className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
                  >
                    {starring ? "Starring..." : `${count} ☆`}
                  </button>
                )}
                {starred && (
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnStar();
                    }}
                    disabled={starring}
                    className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
                  >
                    {count}⭐
                  </button>
                )}
              </div>
            </div>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Updated {updated}
            </div>
          </div>
        </a>
      )}

      {/* Confirm Unstar */}
      {showConfirm && !message && (
        <div>
          <div className="grid h-full min-h-[12rem] place-items-center p-5 text-center">
            <p>Would you like to unstar this?</p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  confirmUnstar("yes")}}
                className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  confirmUnstar("no")}}
                className="px-2 py-1 rounded bg-gray-500 hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className="grid h-full min-h-[12rem] place-items-center p-5">
          <div className="mt-3 text-red-600 font-medium transition-opacity duration-300 ease-out">
            {message}
          </div>
        </div>
      )}
    </div>
  );
}
