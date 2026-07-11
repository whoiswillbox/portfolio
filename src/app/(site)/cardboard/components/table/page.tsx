import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/cardboard/table";
import { ComponentPage, Demo } from "../_component-page";

const rows = [
  { inv: "INV001", status: "Paid", method: "Credit Card", total: "$250.00" },
  { inv: "INV002", status: "Pending", method: "PayPal", total: "$150.00" },
  { inv: "INV003", status: "Unpaid", method: "Bank Transfer", total: "$350.00" },
];

export default function TableDocs() {
  return (
    <ComponentPage
      title="Table"
      description="A simple data table — header, body, footer, and caption. Rows highlight on hover and when selected using the secondary surface token."
    >
      <Demo title="Default" caption="Scrolls horizontally inside its container on narrow viewports.">
        <div className="w-full">
          <Table>
            <TableCaption>A list of recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.inv}>
                  <TableCell className="font-medium">{r.inv}</TableCell>
                  <TableCell>{r.status}</TableCell>
                  <TableCell>{r.method}</TableCell>
                  <TableCell className="text-right">{r.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$750.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Demo>
    </ComponentPage>
  );
}
