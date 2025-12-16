"use client";

import Link from "next/link";

type Props = {
  types: string[];
  currentType: string;
};

export default function TypeFilter({ types, currentType }: Props) {
  const selectedTypes = currentType
    ? currentType.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div
      style={{
        margin: "12px 0 24px",
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <span style={{ marginRight: "8px" }}>Types:</span>
      {types.map((type) => {
        const isSelected = selectedTypes.includes(type);
        const nextSelected = isSelected
          ? selectedTypes.filter((t) => t !== type)
          : [...selectedTypes, type];
        const nextTypeParam = nextSelected.join(",");

        const href = nextTypeParam
          ? `/?type=${encodeURIComponent(nextTypeParam)}&page=1`
          : "/?page=1";

        return (
          <Link
            key={type}
            href={href}
            style={{
              padding: "10px 20px",
              border: "1px solid #e5e7eb",
              background: isSelected ? "#3B82F6" : "#ffffff",
              color: isSelected ? "#ffffff" : "#111827",
              fontSize: "16px",
              marginRight: "10px"
            }}
          >
            {type}
          </Link>
        );
      })}
    </div>
  );
}