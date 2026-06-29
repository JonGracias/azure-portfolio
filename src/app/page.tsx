import ContextProviderTree from "@/context/ContextProviderTree";
import RepoList from "@/components/RepoList";
import { fetchRepos } from "@/lib/github";


// --------------------
// SEO Metadata
// --------------------
export const metadata = {
  title: "Jonathan Gracias – Portfolio",
  description:
    "A showcase of projects spanning backend automation, web development, creative technology, and interactive demos.",
  openGraph: {
    title: "Jonathan Gracias – Portfolio",
    description:
      "A showcase of projects spanning backend automation, web development, creative technology, and interactive demos.",
    url: "https://your-domain.com/",
    siteName: "Jonathan Gracias Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonathan Gracias – Portfolio",
    description:
      "A showcase of projects spanning backend automation, web development, creative technology, and interactive demos.",
  },
};


export default function Page() {
  return (
    <ContextProviderTree>
      <main className="
          grid
          grid-rows-[auto,1fr,auto]
          h-dvh
          overflow-hidden
        ">
        {/* Header / Intro */}
        <section
          aria-labelledby="portfolio-heading"
          className="
            flex flex-col
            w-full max-w-[1000px] mx-auto
            px-4 py-8 sm:py-10
            gap-4
            items-center text-center
          "
        >
          <h1
            id="portfolio-heading"
            className="
              md:text-4xl text-2xl font-extrabold
              text-blue-400 dark:text-blue-300
              drop-shadow-sm
            "
          >
            Jonathan Gracias
          </h1>
        </section>

        {/* Repo Grid */}
        <section
          aria-label="Repository List"
          className="
            min-h-0
            flex justify-center
    
          "
        >
          <RepoList />
        </section>

        {/* Footer */}
        <footer
          className="
            text-center text-sm text-gray-500
            py-4
          "
        >
          © {new Date().getFullYear()} Jonathan Gracias — Built with Next.js + Tailwind + Azure
        </footer>

      </main>
    </ContextProviderTree>
  );
}
