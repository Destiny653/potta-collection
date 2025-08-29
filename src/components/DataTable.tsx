import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { ILocation } from "@/types";
import { Trash2, Edit } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import useMessage from '@/hooks/useMessage';
import useDeleteLocation from '@/hooks/useDeleteLocation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface DataTableProps {
  data: ILocation[];
  onEdit: (location: ILocation) => void;
  onDelete: (id: string) => void;
}

const DataTable: FC<DataTableProps> = ({ data, onEdit, onDelete }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<ILocation | null>(null);

  const message = useMessage();
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteLocation();

  // Function to handle the delete button click and open the confirmation dialog
  const handleDeleteClick = (location: ILocation) => {
    setLocationToDelete(location);
    setIsConfirmOpen(true);
  };

  // Function to perform the actual deletion after confirmation
  const handleConfirmDelete = () => {
    if (locationToDelete) {
      deleteMutate(locationToDelete.id, {
        onSuccess: () => {
          message({ status: "success", message: "Location deleted successfully." });
          setIsConfirmOpen(false);
          setLocationToDelete(null);
        },
        onError: (error: any) => {
          message({ status: "error", message: error.message || "Failed to delete location." });
        },
      });
    }
  };

  // Define columns inside the component to access the `onEdit` and new `handleDeleteClick` props
  const columns: ColumnDef<ILocation>[] = [
    {
      accessorKey: "business_name",
      header: "Business Name",
    },
    {
      accessorKey: "contact_number",
      header: "Contact Number",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "referral_code",
      header: "Referral Code",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className=" cursor-pointer" onClick={() => onEdit(row.original)}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" className="text-red-500 border  cursor-pointer" size="sm" onClick={() => handleDeleteClick(row.original)}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search all columns..."
        value={globalFilter ?? ""}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Show pagination buttons only when there is more than one page */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}

      {/* Custom Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-xl h-38">
          <DialogHeader>
            <DialogTitle className="text-[#25b308]">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the location for **{locationToDelete?.business_name}**? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              className="text-red-500"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataTable;
