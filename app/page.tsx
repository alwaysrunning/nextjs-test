import { Metadata } from 'next';
import TypeFilter from './components/TypeFilter';
import PokemonGrid from './components/PokemonGrid';
import PaginationControls from './components/PaginationControls';

const PAGE_SIZE = 24;

export const metadata: Metadata = {
  title: 'IT Consultis',
};

async function getTypes() {
  const res = await fetch('https://pokeapi.co/api/v2/type', {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch types');
  }
  
  const data = await res.json();
  
  return data.results.map((item: { name: string; url: string }) => item.name);
}

async function getPokemonByType(types: string[]): Promise<{ name: string; url: string }[]> {
  // 获取所有类型的列表
  const allPokemonByType = await Promise.all(
    types.map(async (type) => {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch type: ${type}`);
      }
      const data = await res.json();
      // 返回该类型下的所有pokemon
      return data.pokemon.map((item: { pokemon: { name: string; url: string } }) => ({
        name: item.pokemon.name,
        url: item.pokemon.url,
      }));
    })
  );

  // 如果有多个类型，取交集（必须同时属于所有选中的类型）
  if (allPokemonByType.length === 1) {
    return allPokemonByType[0];
  }

  // 多个类型时，找到同时属于所有类型的pokemon
  const pokemonMap = new Map<string, { name: string; url: string }>();
  
  // 第一个类型的pokemon作为基准
  allPokemonByType[0].forEach((pokemon: { name: string; url: string }) => {
    pokemonMap.set(pokemon.name, pokemon);
  });

  // 后续类型，只保留交集
  for (let i = 1; i < allPokemonByType.length; i++) {
    const currentTypePokemon = new Set(allPokemonByType[i].map((p: { name: string; url: string }) => p.name));
    // 删除不在当前类型中的pokemon
    for (const [name] of pokemonMap) {
      if (!currentTypePokemon.has(name)) {
        pokemonMap.delete(name);
      }
    }
  }

  return Array.from(pokemonMap.values());
}

async function getData(page: number, types?: string[]) {
  // 如果指定了类型，使用 type 接口
  if (types && types.length > 0) {
    const allPokemon = await getPokemonByType(types);
    const totalCount = allPokemon.length;
    const offset = (page - 1) * PAGE_SIZE;
    const paginatedPokemon = allPokemon.slice(offset, offset + PAGE_SIZE);
    
    return {
      count: totalCount,
      results: paginatedPokemon,
    };
  }

  // 没有类型过滤时，使用原来的接口
  const offset = (page - 1) * PAGE_SIZE;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  return res.json();
}

export default async function Page(props: {
  searchParams?: {
    type?: string;
    page?: string;
  };
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const currentType = searchParams?.type || '';
  const selectedTypes = currentType
    ? currentType.split(',').map((t) => t.trim()).filter(Boolean)
    : [];
  const types = await getTypes();
  const data = await getData(currentPage, selectedTypes.length > 0 ? selectedTypes : undefined);
  const totalPages = Math.ceil(data.count / PAGE_SIZE);

  return (
    <div style={{ padding: '10px 40px' }}>
      <div 
        style={{ width: '100%', fontSize: '16px',  textAlign: 'center', padding: '10px 0' }}>
          Welcome to Pokemon world
      </div>
      <div>Total: {data.count}</div>
      <TypeFilter types={types} currentType={currentType} />
      <PokemonGrid items={data.results} />
      <PaginationControls currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}