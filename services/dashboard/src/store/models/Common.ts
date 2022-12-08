export type HeadCell = {
  id: string;
  label: string;
};

export type Order = 'asc' | 'desc';

export type IPagination = {
  perPage: number;
  totalPage: number;
  pageIndex: number;
  order: Order;
  orderBy: string;
  handleRequestSort: (property: string) => () => void;
  changePage: (value: number) => void;
  changePerPage: (value: number) => void;
};

export type History = {
  push(url: string): void;
  replace(url: string): void;
};
