export interface PagedResult<T> {
    items: T[];
    totalPages: number;
    totalItems: number;
    page: number;
  }