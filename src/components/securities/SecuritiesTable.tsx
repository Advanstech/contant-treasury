"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Security, securitiesApi } from "@/lib/api";
import { Pagination } from "@/components/ui/pagination";

export function SecuritiesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data = [], isLoading } = useQuery({
    queryKey: ["securities"],
    queryFn: () => securitiesApi.getAll(),
    staleTime: 30_000,
  });

  const columns = React.useMemo<ColumnDef<Security>[]>(
    () => [
      { accessorKey: "name", header: "Instrument" },
      {
        accessorKey: "securityType",
        header: "Type",
        cell: ({ getValue }) => {
          const v = getValue<string | undefined>() || "";
          return v.replace("TREASURY_", "Treasury ").replace("BILL", "Bill").replace("BOND", "Bond");
        },
      },
      {
        accessorKey: "tenorDays",
        header: "Tenor",
        cell: ({ getValue }) => {
          const v = getValue<number | undefined>();
          return typeof v === "number" ? `${v}d` : "-";
        },
      },
      {
        accessorKey: "couponRate",
        header: "Coupon",
        cell: ({ getValue }) => {
          const v = getValue<number | undefined>();
          if (typeof v !== "number" || Number.isNaN(v) || v === 0) return "-";
          return `${v.toFixed(2)}%`;
        },
      },
      {
        accessorKey: "currentYield",
        header: "Yield",
        cell: ({ getValue }) => {
          const v = getValue<number | undefined>();
          return typeof v === "number" && !Number.isNaN(v) ? `${v.toFixed(2)}%` : "-";
        },
      },
      {
        accessorKey: "maturityDate",
        header: "Maturity",
        cell: ({ getValue }) => getValue<string | undefined>() ?? "-",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  if (isLoading) {
    return (
      <div className="w-full rounded-md border p-6 text-sm text-muted-foreground">
        Loading securities…
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-foreground">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border">
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className="whitespace-nowrap px-4 py-3 text-left font-semibold cursor-pointer select-none hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === "asc" && <span className="text-primary">▲</span>}
                      {h.column.getIsSorted() === "desc" && <span className="text-primary">▼</span>}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-card">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-border hover:bg-accent/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-foreground">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        onPageChange={(page) => setPagination(prev => ({ ...prev, pageIndex: page - 1 }))}
        totalItems={data.length}
        itemsPerPage={pagination.pageSize}
        className="mt-4"
      />
    </div>
  );
}
