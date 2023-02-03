import { useState } from 'react';
import { Order } from 'src/store/app/app.type';


const useStableSort = () => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(20);

  const handleRequestSort = (property: string) => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangePerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    order,
    orderBy,
    page,
    perPage,
    handleRequestSort,
    handleChangePage,
    handleChangePerPage,
  };
};

export default useStableSort;
