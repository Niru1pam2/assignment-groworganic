import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import api from "~/lib/axios";
import type { ApiResponse, Artwork } from "~/types";

import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getPaginationNumbers } from "~/lib/paginationHelper";
import { ChevronDown } from "lucide-react";
import { OverlayPanel } from "primereact/overlaypanel";

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
  const [inputSelectedRows, setInputSelectedRows] = useState<number>(0);
  const op = useRef<OverlayPanel>(null);
  const [input, setInput] = useState<number>(0);

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

  const handleSubmit = () => {
    setInputSelectedRows(input);
    setSelectedArtworksIds(new Set());
    setDeselectedArtworksIds(new Set());
  };

  return (
    <div className="w-full p-4 space-y-5">
      <span className="font-bold mb-2">
        Total Selected:{" "}
        {inputSelectedRows +
          selectedArtworksIds.size -
          deselectedArtworksIds.size}
      </span>

      <OverlayPanel ref={op}>
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="font-bold">Select Multiple Rows</h2>
            <p className="text-sm text-gray-500">
              Enter number of rows to select across all pages
            </p>
          </div>
          <div className="flex justify-between gap-2">
            <input
              type="number"
              onChange={(e) => setInput(parseInt(e.target.value) || 0)}
              className="border h-10 flex-1 p-2"
            />

            <Button size="small" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </OverlayPanel>
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
          headerStyle={{ width: "4rem", position: "relative" }}
          header={
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <button
                className="cursor-pointer text-gray-600 hover:text-black border-none bg-transparent"
                onClick={(e) => op.current?.toggle(e)}
              >
                <ChevronDown size={20} />
              </button>
            </div>
          }
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
