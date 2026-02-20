export const getPaginationNumbers = (currentPage: number) => {
  const paginationArea = Math.ceil(currentPage / 5);
  const endPage = paginationArea * 5;
  const startPage = endPage - 4;

  const pages = [];

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
};
