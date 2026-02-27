'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Building2,
    Package,
    Plus,
    MapPin,
    LayoutDashboard,
    Home,
    ChevronRight,
    PlusCircle,
    Database
} from 'lucide-react';
import Link from 'next/link';
import ProductsTable from '@/components/ProductsTable';
import DataTable from '@/components/DataTable';
import useGetProducts from '@/hooks/useGetProducts';
import useGetLocations from '@/hooks/useGetLocations';
import CreateProductModal from '@/components/CreateProductModal';
import CreateLocationModal from '@/components/CreateLocationModal';
import { Toaster } from 'react-hot-toast';
import { IProduct, ILocation } from '@/types';
import { cn } from '@/lib/utils';

type DashboardView = 'overview' | 'locations' | 'products';

export default function DashboardPage() {
    const [currentView, setCurrentView] = useState<DashboardView>('overview');

    const { data: products = [], isLoading: productsLoading } = useGetProducts();
    const { data: locations = [], isLoading: locationsLoading } = useGetLocations();

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduct | undefined>(undefined);
    const [editingLocation, setEditingLocation] = useState<ILocation | undefined>(undefined);

    const handleEditProduct = (product: IProduct) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    const handleEditLocation = (location: ILocation) => {
        setEditingLocation(location);
        setIsLocationModalOpen(true);
    };

    const closeProductModal = () => {
        setIsProductModalOpen(false);
        setEditingProduct(undefined);
    };

    const closeLocationModal = () => {
        setIsLocationModalOpen(false);
        setEditingLocation(undefined);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Toaster position="top-right" />

            {/* Sidebar */}
            <aside className="w-64 bg-[#0B1120] text-gray-300 flex flex-col fixed h-full z-50">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Location Manager</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    <button
                        onClick={() => setCurrentView('overview')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            currentView === 'overview'
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-800 hover:text-white"
                        )}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                    </button>

                    <button
                        onClick={() => setCurrentView('locations')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            currentView === 'locations'
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-800 hover:text-white"
                        )}
                    >
                        <MapPin className="h-5 w-5" />
                        Locations
                    </button>

                    <button
                        onClick={() => setCurrentView('products')}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            currentView === 'products'
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-800 hover:text-white"
                        )}
                    >
                        <Package className="h-5 w-5" />
                        Products
                    </button>
                </nav>

                <div className="p-4 mt-auto border-t border-gray-800">
                    <Link href="/">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                            <Home className="h-5 w-5" />
                            Main Portal
                        </button>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <header className="bg-white border-b h-16 flex items-center px-8 flex-shrink-0 sticky top-0 z-40 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 capitalize">
                        {currentView === 'overview' ? 'Dashboard Overview' : `${currentView} Management`}
                    </h2>
                </header>

                <div className="p-8 flex-1">
                    {currentView === 'overview' && (
                        <div className="max-w-full mx-auto space-y-8">
                            {/* Welcome Banner */}
                            <div className="bg-blue-600 rounded-xl p-8 text-white relative overflow-hidden shadow-lg shadow-blue-200">
                                <div className="relative z-10">
                                    <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
                                    <p className="text-blue-100 max-w-2xl leading-relaxed">
                                        Manage your business locations and products efficiently from one place. View analytics,
                                        track inventory, and grow your presence with ease.
                                    </p>
                                </div>
                                {/* Decorative element */}
                                <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-white opacity-10 rounded-full blur-3xl"></div>
                            </div>

                            {/* Main Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Location Card */}
                                <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <div className="bg-blue-50 p-3 rounded-lg w-fit mb-6">
                                        <MapPin className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Location Management</h3>
                                    <p className="text-gray-500 mb-6 text-sm">
                                        Create, edit, and track your business locations on the map.
                                    </p>
                                    <button
                                        onClick={() => setCurrentView('locations')}
                                        className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:translate-x-1 transition-transform"
                                    >
                                        Manage Locations <ChevronRight className="h-4 w-4" />
                                    </button>
                                    <MapPin className="absolute right-[-20px] top-4 h-32 w-32 text-gray-50 opacity-[0.03] group-hover:scale-110 transition-transform" />
                                </div>

                                {/* Product Card */}
                                <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <div className="bg-blue-50 p-3 rounded-lg w-fit mb-6">
                                        <Package className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Product Inventory</h3>
                                    <p className="text-gray-500 mb-6 text-sm">
                                        Keep track of your products, barcodes, and inventory details.
                                    </p>
                                    <button
                                        onClick={() => setCurrentView('products')}
                                        className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:translate-x-1 transition-transform"
                                    >
                                        Manage Products <ChevronRight className="h-4 w-4" />
                                    </button>
                                    <Package className="absolute right-[-20px] top-4 h-32 w-32 text-gray-50 opacity-[0.03] group-hover:scale-110 transition-transform" />
                                </div>
                            </div>

                            {/* Stats and Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Locations Stat */}
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none pt-1">Total Locations</span>
                                        <MapPin className="h-4 w-4 text-blue-500 opacity-60" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-3xl font-bold text-gray-900">{locations.length}</div>
                                        <div className="text-[10px] font-medium text-blue-600">Active presence</div>
                                    </div>
                                </div>

                                {/* Products Stat */}
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none pt-1">Total Products</span>
                                        <Package className="h-4 w-4 text-blue-500 opacity-60" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-3xl font-bold text-gray-900">{products.length}</div>
                                        <div className="text-[10px] font-medium text-blue-600">Inventory items</div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 pt-1">Quick Actions</span>
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setIsProductModalOpen(true)}
                                            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <PlusCircle className="h-4 w-4" /> Add New Product
                                        </button>
                                        <button
                                            onClick={() => setIsLocationModalOpen(true)}
                                            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <PlusCircle className="h-4 w-4" /> Add New Location
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'locations' && (
                        <div className="max-w-full mx-auto space-y-6">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
                                    <p className="text-gray-500 mt-1">Manage and track all business locations.</p>
                                </div>
                                <Button
                                    onClick={() => setIsLocationModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2"
                                >
                                    <Plus className="h-4 w-4" /> Add Location
                                </Button>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
                                {locationsLoading ? (
                                    <div className="h-64 flex items-center justify-center">
                                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
                                    </div>
                                ) : (
                                    <DataTable data={locations} onEdit={handleEditLocation} />
                                )}
                            </div>
                        </div>
                    )}

                    {currentView === 'products' && (
                        <div className="max-w-full mx-auto space-y-6">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Product Inventory</h1>
                                    <p className="text-gray-500 mt-1">Manage product list, barcodes and inventory.</p>
                                </div>
                                <Button
                                    onClick={() => setIsProductModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2"
                                >
                                    <Plus className="h-4 w-4" /> Add Product
                                </Button>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
                                {productsLoading ? (
                                    <div className="h-64 flex items-center justify-center">
                                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
                                    </div>
                                ) : (
                                    <ProductsTable data={products} onEdit={handleEditProduct} />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <footer className="px-8 py-6 text-center text-gray-400 text-[10px] font-medium border-t mt-auto">
                    &copy; {new Date().getFullYear()} LOCATION MANAGER ADMIN PANEL. ALL RIGHTS RESERVED.
                </footer>
            </div>

            {/* Modals */}
            <CreateProductModal
                isOpen={isProductModalOpen}
                onClose={closeProductModal}
                data={editingProduct}
            />
            <CreateLocationModal
                isOpen={isLocationModalOpen}
                onClose={closeLocationModal}
                data={editingLocation}
            />
        </div>
    );
}
