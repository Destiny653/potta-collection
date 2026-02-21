'use client';

import { useState } from 'react';
import CreateLocationModal from '@/components/CreateLocationModal';
import CreateProductModal from '@/components/CreateProductModal';
import DataTable from '@/components/DataTable';
import ProductsTable from '@/components/ProductsTable';
import { Button } from '@/components/ui/button';
import { Toaster } from 'react-hot-toast';
import { ILocation, IProduct } from '@/types';
import useGetLocations from '@/hooks/useGetLocations';
import useGetProducts from '@/hooks/useGetProducts';
import {
  LayoutDashboard,
  MapPin,
  Plus,
  Menu,
  X,
  Settings,
  Package,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ILocation | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const { data: locations, isLoading: isLoadingLocations, refetch: refetchLocations } = useGetLocations();
  const { data: products, isLoading: isLoadingProducts, refetch: refetchProducts } = useGetProducts();

  const handleEditLocation = (location: ILocation) => {
    setSelectedLocation(location);
    setIsLocationModalOpen(true);
  };

  const handleEditProduct = (product: IProduct) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseLocationModal = () => {
    setIsLocationModalOpen(false);
    setSelectedLocation(undefined);
    refetchLocations();
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(undefined);
    refetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex gap-0">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 h-[100vh] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-400" />
            <h1 className="text-xl font-bold">Location Manager</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </button>

          <button
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'locations' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
            onClick={() => {
              setActiveTab('locations');
              setIsSidebarOpen(false);
            }}
          >
            <MapPin className="h-5 w-5" />
            <span>Locations</span>
          </button>

          <button
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
            onClick={() => {
              setActiveTab('products');
              setIsSidebarOpen(false);
            }}
          >
            <Package className="h-5 w-5" />
            <span>Products</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className=" w-full">
        {/* Header */}
        <header className="bg-white shadow-sm border-b w-full">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden mr-2"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'locations' && 'Location Management'}
                {activeTab === 'products' && 'Product Management'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
            </div>

            {activeTab === 'locations' && (
              <Button
                onClick={() => setIsLocationModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2 text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Add Location</span>
              </Button>
            )}

            {activeTab === 'products' && (
              <Button
                onClick={() => setIsProductModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2 text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 w-full">
          {activeTab === 'locations' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">All Locations</h2>
                <p className="text-gray-600 mt-1">Manage your business locations</p>
              </div>

              <div className="p-6">
                {isLoadingLocations ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <DataTable data={locations || []} onEdit={handleEditLocation} />
                )}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
                <p className="text-gray-600 mt-1">Manage your product inventory</p>
              </div>

              <div className="p-6">
                {isLoadingProducts ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <ProductsTable data={products || []} onEdit={handleEditProduct} />
                )}
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
                <p className="text-blue-100 text-lg opacity-90 max-w-2xl">
                  Manage your business locations and products efficiently from one place.
                  View analytics, track inventory, and grow your presence With ease.
                </p>
              </div>

              {/* Navigation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  onClick={() => setActiveTab('locations')}
                  className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <MapPin className="h-32 w-32" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="p-4 bg-blue-100 rounded-xl mb-6 group-hover:bg-blue-600 transition-colors">
                      <MapPin className="h-8 w-8 text-blue-600 group-hover:text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Location Management</h3>
                  <p className="text-gray-600 mb-6">Create, edit, and track your business locations on the map.</p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                    <span>Manage Locations</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('products')}
                  className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Package className="h-32 w-32" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="p-4 bg-blue-100 rounded-xl mb-6 group-hover:bg-blue-600 transition-colors">
                      <Package className="h-8 w-8 text-blue-600 group-hover:text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Product Inventory</h3>
                  <p className="text-gray-600 mb-6">Keep track of your products, barcodes, and inventory details.</p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                    <span>Manage Products</span>
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Locations</h3>
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{locations?.length || 0}</p>
                  <div className="mt-2 text-xs text-blue-600 font-medium">Active presence</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Products</h3>
                    <Package className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{products?.length || 0}</p>
                  <div className="mt-2 text-xs text-blue-600 font-medium">Inventory items</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Quick Actions</h3>
                  </div>
                  <div className="space-y-2 mt-2">
                    <button
                      onClick={() => { setIsProductModalOpen(true) }}
                      className="w-full text-left text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </button>
                    <button
                      onClick={() => { setIsLocationModalOpen(true) }}
                      className="w-full text-left text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Location
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Application Information</h3>
                  <p className="text-gray-600">Location Management System</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Preferences</h3>
                  <p className="text-gray-600">No preferences available</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <CreateLocationModal
        isOpen={isLocationModalOpen}
        onClose={handleCloseLocationModal}
        data={selectedLocation}
      />
      <CreateProductModal
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        data={selectedProduct}
      />
    </div>
  );
}