import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useRef, useState } from "react";
import type { Artwork } from "~/types";

import { ChevronDown } from "lucide-react";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import TablePagination from "~/components/table-pagination";
import { useArtWorksData } from "~/hooks/useArtworksData";
import { useInputSelection } from "~/hooks/useInputSelection";

export default function ArtWorks() {
  const {
    artworks,
    currentPage,
    onNextPageClick,
    onPrevPageClick,
    totalEntries,
    totalPages,
    setCurrentPage,
  } = useArtWorksData();

  const {
    currentlySelected,
    deselectedArtworksIds,
    handleSelectionChange,
    handleSubmit,
    inputSelectedRows,
    selectedArtworksIds,
  } = useInputSelection(artworks, currentPage);

  const [input, setInput] = useState<number>(0);
  const op = useRef<OverlayPanel>(null);

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

            <Button size="small" onClick={() => handleSubmit(input)}>
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
        onSelectionChange={(e) => handleSelectionChange(e.value as Artwork[])}
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

      <TablePagination
        currentPage={currentPage}
        onNextPageClick={onNextPageClick}
        onPrevPageClick={onPrevPageClick}
        setCurrentPage={setCurrentPage}
        totalEntries={totalEntries}
        totalPages={totalPages}
      />
    </div>
  );
}
