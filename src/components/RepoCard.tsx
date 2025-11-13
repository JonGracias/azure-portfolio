// src/components/RepoCard.tsx
"use client";
import { useState, useEffect, useRef, JSX } from "react";
import { useRepoContext } from "@/context/RepoContext";
import { Repo } from "@/lib/types";

export default function RepoList({ repo }: { repo: Repo }) {
  const {
    starred,
    setStarred,
    isLoaded,
    count,
    setCount,
  } = useRepoContext();
  const repoStarred = starred[repo.name] ?? false;
  const starCount = count[repo.name] ?? 0;
  const updateStarred = (value: boolean) =>
    setStarred(prev => ({ ...prev, [repo.name]: value }));
  const updateCount = (value: number) =>
    setCount(prev => ({ ...prev, [repo.name]: value }));

  const [starring, setStarring] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);


  const updated: string = new Date(repo.updated_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Pass Scroll Events
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      document.querySelector(".scroll-container")?.scrollBy({
        top: e.deltaY,
        behavior: "smooth",
      });
    };

    const popup = document.getElementById("popup-card");
    popup?.addEventListener("wheel", handleWheel, { passive: false });

    return () => popup?.removeEventListener("wheel", handleWheel);
  }, []);

  /* // Check Star 
  useEffect(() => {
    async function checkStarred(): Promise<void> {
      try {
        const res = await fetch(`/api/github/starred?owner=${repo.owner}&repo=${repo.name}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data.authed && data.starred) updateStarred(true);
      } finally {
        updateIsLoaded(true);
      }
    } 
    checkStarred();
  }, [repo.owner, repo.name]); */

  // Handle Star
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
        updateStarred(true);
        updateCount(data.count);
      }
    } finally {
      setStarring(false);
    }
  }

  // Handle Unstar
  async function handleUnStar(): Promise<void> {
    setShowConfirm(true);
  }

  // Confirm Unstar - Joke Message
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
    // MAIN CONTAINER
    < section
      ref={cardRef}
      className={[
        "group block w-full rounded-xl border shadow-sm",
        "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700",
        "hover:border-blue-400 active:border-blue-400 hover:dark:border-orange-400 hover:dark:active-orange-400",
        "transform-gpu origin-center transition-transform duration-200 ease-out",
        "hover:scale-105",
        "relative z-0 md:group-hover:z-20 md:group-focus-within:z-20 md:group-hover-within:overflow-visible",
        "hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500",
        "min-h-[12rem]",
        "rounded-xl",
      ].join(" ")}> 

      {/* Main Card Content */}
      {!showConfirm && !message && (
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="h-full block" >
        
          {/* Card Inner Grid */}
          <div className="grid h-full grid-rows-[auto,auto,auto,auto] gap-2 p-5">

            {/* Repo Name & Description */}
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400 truncate z-10">
              {repo.name}
            </h3>
            <div className="
                  overflow-hidden
                  text-sm text-gray-600 dark:text-gray-300 leading-5 break-words
                  max-h-[4rem] min-h-[4rem] opacity-70
                  transition-[max-height,opacity] duration-200 ease-out
                  group-hover:max-h-40 group-hover:opacity-100
                  group-focus-within:max-h-40 group-focus-within:opacity-100">
              {repo.description ?? "No description"}
            </div>

            {/* Languages and Stars Row */}
            <div className="
                  flex items-center justify-between 
                  text-base sm:text-sm
                  px-4 py-2 sm:px-0 py-0
                  text-gray-500 dark:text-gray-400">
                       
              {/* Languages */}
              <div className="w-1/2 text-left truncate">
                <span>{repo.language ?? "Unknown"}</span>
              </div>

              {/* Star/UnStar Container */}
              {isLoaded &&
              <div className="
                    text-sm text-gray-500 dark:text-gray-400
                    w-1/2 text-right truncate">
                      
                  {/* Star Button */}
                  {!repoStarred && (
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleStar();
                      }}
                      disabled={starring || repoStarred}
                      className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors">
                      {starring ? "Starring..." : `${starCount} ☆`}
                    </button>
                  )}
            
                  {/* Unstar Button */}
                  {repoStarred && (
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnStar();
                      }}
                      disabled={starring}
                      className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors">
                      {starCount}⭐
                    </button>
                  )} 
              </div>
              }
              
            </div>
        

            {/* Updated At */}    
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
    </section>
  );
}
