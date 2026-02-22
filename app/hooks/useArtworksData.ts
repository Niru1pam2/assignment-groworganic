import { useEffect, useState } from "react";
import api from "~/lib/axios";
import type { ApiResponse, Artwork } from "~/types";

export function useArtWorksData() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalEntries, setTotalEntries] = useState<number>(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get<ApiResponse>(`?page=${currentPage}`);
        console.log("RESPONSE", response);
        setArtworks(response.data.data);
        setTotalPages(response.data.pagination.total_pages);
        setTotalEntries(response.data.pagination.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, [currentPage]);

  const onNextPageClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const onPrevPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    artworks,
    currentPage,
    totalPages,
    totalEntries,
    onNextPageClick,
    onPrevPageClick,
    setCurrentPage,
  };
}
