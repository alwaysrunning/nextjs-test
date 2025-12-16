"use client";

import Image from "next/image";

type PokemonItem = {
  name: string;
  url: string;
};

type Props = {
  items: PokemonItem[];
};

export default function PokemonGrid({ items }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "50px",
      }}
    >
      {items.map((item) => {
        const id = item.url.split("/").filter(Boolean).pop();
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

        return (
          <div
            key={item.name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              border: "1px solid #e5e7eb",
              padding: "10px",
            }}
          >
            <div>{item.name}</div>
            <Image src={imageUrl} alt={item.name} width={80} height={80} />
            <div>Number: {id}</div>
          </div>
        );
      })}
    </div>
  );
}


