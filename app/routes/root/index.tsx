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
  const [deselectedArtworksIds, setDeselectedArtworksIds] = useState<
    Set<number>
  >(new Set());
  const [inputSelectedRows, setInputSelectedRows] = useState<number>(24);

  const currentlySelected = artworks.filter((artwork, idx) => {
    const activeIndex = (currentPage - 1) * 12 + idx;
    const isinBound = activeIndex < inputSelectedRows;

    if (isinBound) {
      return !deselectedArtworksIds.has(artwork.id);
    } else {
      return selectedArtworksIds.has(artwork.id);
    }
  });

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
        Total Selected:{" "}
        {inputSelectedRows +
          selectedArtworksIds.size -
          deselectedArtworksIds.size}
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
        selection={currentlySelected}
        onSelectionChange={(e) => {
          const newlySelected = e.value;
          const newlySelectedIds = new Set(newlySelected.map((n) => n.id));

          const toAddSelected = new Set<number>();
          const toRemoveSelected = new Set<number>();
          const toAddDeselected = new Set<number>();
          const toRemoveDeselected = new Set<number>();

          artworks.forEach((artwork, idx) => {
            const activeIndex = (currentPage - 1) * 12 + idx;
            const isinBound = activeIndex < inputSelectedRows;
            const userChecked = newlySelectedIds.has(artwork.id);

            if (isinBound) {
              if (userChecked) {
                toRemoveDeselected.add(artwork.id);
              } else {
                toAddDeselected.add(artwork.id);
              }
            } else {
              if (userChecked) {
                toAddSelected.add(artwork.id);
              } else {
                toRemoveSelected.add(artwork.id);
              }
            }
          });

          setSelectedArtworksIds((prev) => {
            const nextSet = new Set(prev);
            toAddSelected.forEach((id) => nextSet.add(id));
            toRemoveSelected.forEach((id) => nextSet.delete(id));
            return nextSet;
          });

          setDeselectedArtworksIds((prev) => {
            const nextSet = new Set(prev);
            toAddDeselected.forEach((id) => nextSet.add(id));
            toRemoveDeselected.forEach((id) => nextSet.delete(id));
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
