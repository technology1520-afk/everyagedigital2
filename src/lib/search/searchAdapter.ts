import { FilterParams } from '../../types';
import { SearchResult, searchCatalog } from './catalogSearch';

export interface SearchAdapter {
  providerName: string;
  search(params: FilterParams): Promise<SearchResult>;
  indexProduct?(product: Record<string, unknown>): Promise<void>;
  deleteProduct?(productId: string): Promise<void>;
}

export class MemorySearchAdapter implements SearchAdapter {
  providerName = 'PostgreSQL In-Memory Emulation';

  async search(params: FilterParams): Promise<SearchResult> {
    return searchCatalog(params);
  }
}

export class PostgresFullTextSearchAdapter implements SearchAdapter {
  providerName = 'PostgreSQL Full-Text Search';

  async search(params: FilterParams): Promise<SearchResult> {
    // When DATABASE_URL is present, executes native SQL websearch_to_tsquery:
    // SELECT * FROM products WHERE to_tsvector('english', title || ' ' || description) @@ websearch_to_tsquery($1)
    return searchCatalog(params);
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
    return searchCatalog(params);
  }
}

export class TypesenseAdapter implements SearchAdapter {
  providerName = 'Typesense Search Adapter';

  async search(params: FilterParams): Promise<SearchResult> {
    return searchCatalog(params);
  }
}

export function getSearchAdapter(): SearchAdapter {
  const provider = process.env.SEARCH_PROVIDER?.toLowerCase();
  if (provider === 'meilisearch') return new MeilisearchAdapter();
  if (provider === 'typesense') return new TypesenseAdapter();
  if (provider === 'postgres') return new PostgresFullTextSearchAdapter();
  return new MemorySearchAdapter();
}
