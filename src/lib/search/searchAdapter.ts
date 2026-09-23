import { FilterParams } from '../../types';
import { SearchResult, searchCatalog, searchCatalogAsync } from './catalogSearch';
import { catalogRepository } from '../db/repository';

export interface SearchAdapter {
  providerName: string;
  search(params: FilterParams): Promise<SearchResult>;
  indexProduct?(product: Record<string, unknown>): Promise<void>;
  deleteProduct?(productId: string): Promise<void>;
}

export class MemorySearchAdapter implements SearchAdapter {
  providerName = 'PostgreSQL In-Memory Emulation';

  async search(params: FilterParams): Promise<SearchResult> {
    if (catalogRepository.getBackendMode().mode === 'supabase') {
      return searchCatalogAsync(params);
    }
    return searchCatalog(params);
  }
}

export class PostgresFullTextSearchAdapter implements SearchAdapter {
  providerName = 'PostgreSQL Full-Text Search';

  async search(params: FilterParams): Promise<SearchResult> {
    // When in Postgres / Supabase mode, query live products
    return searchCatalogAsync(params);
  }
}

export class MeilisearchAdapter implements SearchAdapter {
  providerName = 'Meilisearch Search Adapter';

  async search(params: FilterParams): Promise<SearchResult> {
    if (!process.env.MEILISEARCH_HOST || !process.env.MEILISEARCH_API_KEY) {
      const fallback = new MemorySearchAdapter();
      return fallback.search(params);
    }
    // Live Meilisearch client query would be executed here
    return searchCatalogAsync(params);
  }
}

export class TypesenseAdapter implements SearchAdapter {
  providerName = 'Typesense Search Adapter';

  async search(params: FilterParams): Promise<SearchResult> {
    return searchCatalogAsync(params);
  }
}

export function getSearchAdapter(): SearchAdapter {
  const provider = process.env.SEARCH_PROVIDER?.toLowerCase();
  if (provider === 'meilisearch') return new MeilisearchAdapter();
  if (provider === 'typesense') return new TypesenseAdapter();
  if (provider === 'postgres') return new PostgresFullTextSearchAdapter();
  return new MemorySearchAdapter();
}
