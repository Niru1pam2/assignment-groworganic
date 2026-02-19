import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import api from "~/lib/axios";
import type { ApiResponse, Artwork } from "~/types";

import "primereact/resources/themes/lara-light-cyan/theme.css";

export default function ArtWorks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get<ApiResponse>("?page=1");

        setArtworks(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="w-full p-4">
      <DataTable
        value={artworks}
        dataKey="id"
        tableStyle={{ minWidth: "60rem" }}
        stripedRows
      >
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
        ></Column>
        <Column field="date_start" header="Start Date" align={"left"}></Column>
        <Column field="date_end" header="End Date" align={"left"}></Column>
      </DataTable>
    </div>
  );
}
