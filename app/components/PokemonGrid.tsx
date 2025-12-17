"use client";

import Image from "next/image";
import { useState } from "react";

type PokemonItem = {
  name: string;
  url: string;
};

type Props = {
  items: PokemonItem[];
};

// 默认占位符图片（可以使用一个简单的 SVG 或 base64 图片）
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3ELoading...%3C/text%3E%3C/svg%3E";

function PokemonCard({ item }: { item: PokemonItem }) {
  const id = item.url.split("/").filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setIsLoading(false);
    // 如果主图加载失败，使用占位符
    setImgSrc(PLACEHOLDER_IMAGE);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        border: "1px solid #e5e7eb",
        padding: "10px",
        position: "relative",
      }}
    >
      <div>{item.name}</div>
      <div
        style={{
          position: "relative",
          width: 80,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f3f4f6",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid #e5e7eb",
                borderTop: "2px solid #3B82F6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        )}
        <Image
          src={imgSrc}
          alt={item.name}
          width={80}
          height={80}
          onError={handleError}
          onLoad={handleLoad}
          loading="lazy"
          unoptimized
          style={{
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      </div>
      <div>Number: {id}</div>
    </div>
  );
}

export default function PokemonGrid({ items }: Props) {
  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "50px",
        }}
      >
        {items.map((item) => (
          <PokemonCard key={item.name} item={item} />
        ))}
      </div>
    </>
  );
}


