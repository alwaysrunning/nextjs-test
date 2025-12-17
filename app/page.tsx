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

async function getData(page: number) {
  const offset = (page - 1) * PAGE_SIZE;
  // 默认会缓存，添加 { cache: 'no-store' } 禁用缓存
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`, {
    cache: 'no-store', // 或 'force-cache'
  });

  // 通过type来进行过滤的接口没找到
  
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
  const types = await getTypes();
  const data = await getData(currentPage);
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