import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import api from "~/lib/axios";
import type { ApiResponse, Artwork } from "~/types";

import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getPaginationNumbers } from "~/lib/paginationHelper";

export default function ArtWorks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalEntries, setTotalEntries] = useState<number>(1);
  const [selectedArtworksIds, setSelectedArtworksIds] = useState<Set<number>>(
    new Set(),
  );

  console.log(selectedArtworksIds);

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

  const pagesInBetween = getPaginationNumbers(currentPage);

  return (
    <div className="w-full p-4 space-y-5">
      <span className="font-bold mb-2">
        {selectedArtworksIds?.size
          ? `Selected ${selectedArtworksIds.size} rows`
          : ""}
      </span>
      <DataTable
        value={artworks}
        dataKey="id"
        tableStyle={{ minWidth: "60rem" }}
        stripedRows
        size="small"
        rows={12}
        first={(currentPage - 1) * 12}
        selectionMode={"checkbox"}
        selection={artworks.filter((artwork) =>
          selectedArtworksIds.has(artwork.id),
        )}
        onSelectionChange={(e) => {
          const newlySelected = e.value;

          setSelectedArtworksIds((prev) => {
            const nextSet = new Set(prev);

            artworks.forEach((artwork) => {
              nextSet.delete(artwork.id);
            });

            newlySelected.forEach((artwork) => {
              nextSet.add(artwork.id);
            });

            return nextSet;
          });
        }}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>

        <Column field="title" header="Title" align={"left"}></Column>
        <Column
          field="place_of_origin"
          header="Place of Origin"
          align={"left"}
        ></Column>
        <Column field="artist_display" header="Artist" align={"left"}></Column>
        <Column
          field="inscriptions"
          header="Inscriptions"
          align={"left"}
          body={(rowData: Artwork) => rowData.inscriptions || "NA"}
        ></Column>
        <Column field="date_start" header="Start Date" align={"left"}></Column>
        <Column field="date_end" header="End Date" align={"left"}></Column>
      </DataTable>

      <div className="flex items-center justify-between border-t p-4">
        <div>
          <span className="text-sm text-gray-500">
            Showing {currentPage * 12 - 12 + 1} to {currentPage * 12} of{" "}
            {totalEntries} entries
          </span>
        </div>
        <div className="flex gap-2 items-center justify-center">
          <Button
            onClick={onPrevPageClick}
            disabled={currentPage === 1}
            size="small"
          >
            Prev
          </Button>
          {pagesInBetween.map((p) => (
            <Button
              severity={currentPage === p ? "secondary" : "info"}
              key={p}
              size="small"
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            onClick={onNextPageClick}
            disabled={currentPage === totalPages}
            size="small"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
