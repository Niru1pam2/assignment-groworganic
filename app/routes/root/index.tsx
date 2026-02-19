import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const products = [
  {
    code: "123",
    name: "Soap",
    category: "Home",
    quantity: 1,
  },
];

export default function ArtWorks() {
  return (
    <div>
      <DataTable value={products} tableStyle={{ minWidth: "50rem" }}>
        <Column field="code" header="Code"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
      </DataTable>
    </div>
  );
}
