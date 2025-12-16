"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function PaginationControls({ currentPage, totalPages }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageLink = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      {currentPage > 1 && (
        <Link
          href={createPageLink(currentPage - 1)}
          style={{
            padding: "8px 20px",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            background: "#3B82F6",
            color: "#fff",
          }}
        >
          Previous
        </Link>
      )}
      {currentPage < totalPages && (
        <Link
          href={createPageLink(currentPage + 1)}
          style={{
            padding: "8px 20px",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            background: "#3B82F6",
            color: "#fff",
          }}
        >
          Next
        </Link>
      )}
    </div>
  );
}


