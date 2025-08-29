'use client';

import { useState } from 'react';
import CreateLocationModal from '@/components/CreateLocationModal';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import  { Toaster } from 'react-hot-toast';
import { ILocation } from '@/types';
import useGetLocations from '@/hooks/useGetLocations';
import { 
  LayoutDashboard, 
  MapPin, 
  Plus, 
  Menu, 
  X,
  Settings
} from 'lucide-react';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ILocation | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('locations');

  const { data: locations, isLoading, refetch } = useGetLocations();

  const handleEdit = (location: ILocation) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLocation(undefined);
    refetch(); // Refresh table after create/update
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
            onClick={() => setActiveTab('locations')}
          >
            <MapPin className="h-5 w-5" />
            <span>Locations</span>
          </button>
          
          {/* <button
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button> */}
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
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'locations' && 'Location Management'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
            </div>
            
            {activeTab === 'locations' && (
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2 text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Add Location</span>
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
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <DataTable data={locations || []} onEdit={handleEdit} />
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Locations</h3>
                <p className="text-3xl font-bold text-blue-600">{locations?.length || 0}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Recent Activity</h3>
                <p className="text-gray-600">No recent activity</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Actions</h3>
                <div className="space-y-2 mt-4">
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Location
                  </Button>
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
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={selectedLocation}
      />
    </div>
  );
}