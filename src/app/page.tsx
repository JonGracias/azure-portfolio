// src/app/page.tsx
import { RepoProvider } from "@/context/RepoContext";
import RepoList from "@/components/RepoList";
import { fetchRepos } from "@/lib/github";
import { Repo } from "@/lib/types";

export default async function Page() {
  const repos: Repo[] = await fetchRepos();

  return (
    <main className="relative flex flex-col min-h-screen overflow-hidden">
      <RepoProvider repos={repos} >
        {/* Name/Introduction */}
        <section className="
                  flex flex-col max-w-[1000px] w-full mx-auto
                  p-4 gap-4 md:gap-2 sm:py-14 md:py-14 items-center text-center">
          <h1 className="z-[100] text-shadow-[1px_1px_2px_black] text-4xl font-extrabold text-blue-500 mb-3">
            Jonathan Gracias – Portfolio
          </h1>

          <p className="z-[100] pt-8 text-white-600 max-w-2xl md:text-left">
            A collection of my projects spanning backend automation, web development,
            and creative technology. Built with Next.js and deployed on Azure.
          </p>
        </section>

        {/* Repos */}
        <section
          className="
          flex flex-col max-w-[1000px] w-full mx-auto
          p-4 gap-8 
          overflow-y-hidden overflow-x-hidden">
          <RepoList/>
        </section>

        {/* Footer */}
        <footer className="z-[100] text-center text-sm text-gray-500 mt-10 py-10">
          © {new Date().getFullYear()} Jonathan Gracias — Built with Next.js + Tailwind + Azure
        </footer>
      </RepoProvider>
    </main>

  );
}
