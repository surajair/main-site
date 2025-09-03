"use client";

import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const link = process.env.APP_DOMAIN?.includes("localhost")
    ? "http://" + process.env.APP_DOMAIN
    : "https://" + process.env.APP_DOMAIN;
  return (
    <html className="h-full">
      <body className="h-full">
        <main className="grid min-h-screen place-items-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-400">500</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
              Something went wrong
            </h1>
            <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
              A critical error occurred. Please refresh the page or try again later.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={reset}
                className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                Try again
              </button>
              <Link href={link} className="text-sm font-semibold text-white">
                Go back home <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
