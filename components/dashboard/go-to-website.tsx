"use client";

import Link from "next/link";

export default function GoToWebsite({ displayUrl }: { displayUrl: string }) {
  return (
    <Link
      href={`https://${displayUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className="leading-none"
      onClick={(e) => e.stopPropagation()}>
      {displayUrl}
    </Link>
  );
}
