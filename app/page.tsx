import { Metadata } from 'next';
import TypeFilter from './components/TypeFilter';
import PokemonGrid from './components/PokemonGrid';
import PaginationControls from './components/PaginationControls';

const PAGE_SIZE = 24;
// 没找到相关接口，先写死
const TYPES = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy', 'stellar', 'unknown'];

export const metadata: Metadata = {
  title: 'IT Consultis',
};

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
  const data = await getData(currentPage);
  const totalPages = Math.ceil(data.count / PAGE_SIZE);

  return (
    <div style={{ padding: '10px 40px' }}>
      <div 
        style={{ width: '100%', fontSize: '16px',  textAlign: 'center', padding: '10px 0' }}>
          Welcome to Pokemon world
      </div>
      <div>Total: {data.count}</div>
      <TypeFilter types={TYPES} currentType={currentType} />
      <PokemonGrid items={data.results} />
      <PaginationControls currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}