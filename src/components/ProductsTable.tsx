"use client";

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
import { IProduct } from "@/types";
import { Trash2, Edit, Package } from 'lucide-react';
import useMessage from '@/hooks/useMessage';
import useDeleteProduct from '@/hooks/useDeleteProduct';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Image from "next/image";

interface ProductsTableProps {
    data: IProduct[];
    onEdit: (product: IProduct) => void;
}

const ProductsTable: FC<ProductsTableProps> = ({ data, onEdit }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

    const message = useMessage();
    const { mutate: deleteMutate, isPending: isDeleting } = useDeleteProduct();

    const handleDeleteClick = (product: IProduct) => {
        setProductToDelete(product);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (productToDelete) {
            deleteMutate(productToDelete.id, {
                onSuccess: () => {
                    message({ status: "success", message: "Product deleted successfully." });
                    setIsConfirmOpen(false);
                    setProductToDelete(null);
                },
                onError: (error: any) => {
                    message({ status: "error", message: error.message || "Failed to delete product." });
                },
            });
        }
    };

    const columns: ColumnDef<IProduct>[] = [
        {
            accessorKey: "image_url",
            header: "Image",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                        {row.original.image_url ? (
                            <Image
                                src={row.original.image_url}
                                alt={row.original.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="h-6 w-6" />
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: "Product Name",
        },
        {
            accessorKey: "barcode",
            header: "Barcode",
        },
        {
            accessorKey: "size",
            header: "Size/Weight",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm" onClick={() => onEdit(row.original)} className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(row.original)} className="cursor-pointer bg-red-600 hover:bg-red-700 text-white">
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
                placeholder="Search products..."
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
                                    <TableHead key={header.id} className="text-center">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-center">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {table.getPageCount() > 1 && (
                <div className="flex items-center justify-between py-4 px-2">
                    <div className="text-sm text-gray-700 font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
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
                </div>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="max-w-md">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogHeader className="text-left">
                            <DialogTitle className="text-gray-900 text-xl">Delete Product</DialogTitle>
                            <DialogDescription className="text-gray-600 mt-2">
                                Are you sure you want to delete **{productToDelete?.name}**? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <DialogFooter className="mt-6 gap-2">
                        <Button variant="outline" onClick={() => setIsConfirmOpen(false)} className="flex-1 sm:flex-none">
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white flex-1 sm:flex-none"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Product"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductsTable;
