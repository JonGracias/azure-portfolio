// src/app/page.tsx
import RepoList from "@/components/RepoList";
import { fetchRepos } from "@/lib/github"; // use your existing fetch helper
import { Repo } from "@/lib/types";

export default async function Page() {
  const repos: Repo[] = await fetchRepos(); // server-side await is OK

  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex flex-col max-w-[1000px] w-full mx-auto
      p-4 gap-8 md:gap-14 sm:py-14 md:py-10">
        <h1 className="text-4xl font-extrabold text-blue-500 mb-3">
          Jonathan Gracias – Portfolio
        </h1>
        <p className="text-white-600 max-w-2xl mx-4 md:text-left">
          A collection of my projects spanning backend automation, web
          development, and creative technology. Built with Next.js and
          deployed on Azure.
        </p>
      </section>

      <section className="flex flex-col max-w-[1000px] w-full mx-auto
      p-8 gap-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4 text-center">
          Featured Repositories
        </h2>
        <RepoList repos={repos} />
      </section>

      <footer className="text-center text-sm text-gray-500 mt-16 fixed bottom-12 left-1/2 -translate-x-1/2">
        © {new Date().getFullYear()} Jonathan Gracias — Built with Next.js + Tailwind + Azure
      </footer>
    </main>
  );
}
