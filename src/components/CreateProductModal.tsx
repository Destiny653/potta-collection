"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FC, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { ISheet, IProductPayload, IProduct } from "@/types";
import { productSchema } from "@/utils/validation";
import CustomButton from "@/components/CustomButton";
import TextInput from "@/components/TextInput";
import useMessage from "@/hooks/useMessage";
import useCreateProduct from "@/hooks/useCreateProduct";
import useUpdateProduct from "@/hooks/useUpdateProduct";
import { Package, Barcode, Scale, Image as ImageIcon, X, Upload } from "lucide-react";
import Image from "next/image";

const CreateProductModal: FC<ISheet<IProduct>> = ({ isOpen, onClose, data }) => {
    const message = useMessage();
    const { mutate: createMutate, isPending: isCreating } = useCreateProduct();
    const { mutate: updateMutate, isPending: isUpdating } = useUpdateProduct();

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<IProductPayload>({
        mode: "onChange",
        resolver: yupResolver(productSchema) as any,
        defaultValues: {
            name: "",
            barcode: "",
            size: "",
            image: null,
        },
    });

    useEffect(() => {
        if (data && isOpen) {
            form.reset({
                name: data.name,
                barcode: data.barcode,
                size: data.size,
                image: null,
            });
            setImagePreview(data.image_url || null);
        } else if (isOpen) {
            form.reset({
                name: "",
                barcode: "",
                size: "",
                image: null,
            });
            setImagePreview(null);
        }
    }, [data, isOpen, form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        form.setValue("image", null);
        setImagePreview(data?.image_url || null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit: SubmitHandler<IProductPayload> = (inputs) => {
        if (data) {
            updateMutate(
                { id: data.id, payload: inputs, existingImageUrl: data.image_url },
                {
                    onSuccess: () => {
                        message({ status: "success", message: "Product updated successfully" });
                        onClose();
                    },
                    onError: (error: any) => {
                        message({ status: "error", message: error.message || "Failed to update product" });
                    },
                }
            );
        } else {
            createMutate(inputs, {
                onSuccess: () => {
                    message({ status: "success", message: "Product created successfully" });
                    onClose();
                },
                onError: (error: any) => {
                    message({ status: "error", message: error.message || "Failed to create product" });
                },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-lg w-[600px] max-w-[95vw] max-h-[90vh] overflow-auto p-0 bg-white shadow-xl">
                <DialogHeader className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900">
                                {data ? "Edit Product" : "Add New Product"}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 mt-1">
                                Fill in the details below to {data ? "update" : "create"} a product.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <TextInput
                            label="Product Name"
                            isRequired
                            placeholder="e.g., Premium Coffee Beans"
                            {...form.register("name")}
                            error={form.formState.errors?.name}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                label="Barcode Number"
                                isRequired
                                placeholder="e.g., 1234567890"
                                {...form.register("barcode")}
                                error={form.formState.errors?.barcode}
                            />
                            <TextInput
                                label="Size / Weight"
                                isRequired
                                placeholder="e.g., 500g, 1L"
                                {...form.register("size")}
                                error={form.formState.errors?.size}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Product Image</label>
                            <div className="mt-1 flex flex-col items-center">
                                {imagePreview ? (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                                    >
                                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">Click to upload product image</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            type="button"
                            className="border-gray-300 hover:bg-gray-50 px-5"
                        >
                            Cancel
                        </Button>
                        <CustomButton
                            type="submit"
                            isLoading={isCreating || isUpdating}
                            className="bg-blue-600 hover:bg-blue-700 px-8"
                        >
                            {data ? "Update Product" : "Create Product"}
                        </CustomButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProductModal;
