import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit3, UserPlus, RotateCcw, Download, Menu, X, Search, Bell, ChevronDown } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

function DriversVehicles() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const driversData = [
    {
      no: 1,
      name: 'David M.',
      email: 'info@example.com',
      phone: '000-000-0000',
      licenseNo: '000-000-0000',
      vehicleType: 'Van',
      assignedRoute: 'David M.',
      status: 'Off-Duty'
    },
    {
      no: 2,
      name: 'Carla G.',
      email: 'info@example.com',
      phone: '000-000-0000',
      licenseNo: '000-000-0000',
      vehicleType: 'Car',
      assignedRoute: 'Carla G.',
      status: 'Active'
    },
    {
      no: 3,
      name: 'David M.',
      email: 'info@example.com',
      phone: '000-000-0000',
      licenseNo: '000-000-0000',
      vehicleType: 'Truck',
      assignedRoute: 'David J.',
      status: 'On-Delivery'
    },
    {
      no: 4,
      name: 'Carla G.',
      email: 'info@example.com',
      phone: '000-000-0000',
      licenseNo: '000-000-0000',
      vehicleType: 'Van',
      assignedRoute: 'Catrin D.',
      status: 'Active'
    },
    {
      no: 5,
      name: 'David M.',
      email: 'info@example.com',
      phone: '000-000-0000',
      licenseNo: '000-000-0000',
      vehicleType: 'Car',
      assignedRoute: 'David M.',
      status: 'Off-Duty'
    },
    {
      no: 6,
      name: 'Carla G.',
      email: 'info@example.com',
      phone: '000-000-0000',
      licenseNo: '000-000-0000',
      vehicleType: 'Truck',
      assignedRoute: 'Carla G.',
      status: 'On-Delivery'
    },
    {
      no: 7,
      name: 'David M.',
      email: 'info@example.com',
      phone: '000-000-0000',
      licenseNo: '000-000-0000',
      vehicleType: 'Van',
      assignedRoute: 'David J.',
      status: 'Off-Duty'
    },
    {
      no: 8,
      name: 'Carla G.',
      email: 'info@example.com',
      phone: '000-000-0000',
      licenseNo: '000-000-0000',
      vehicleType: 'Car',
      assignedRoute: 'Catrin D.',
      status: 'Active'
    },
    {
      no: 9,
      name: 'David M.',
      email: 'info@example.com',
      phone: '000-000-0000',
      licenseNo: '000-000-0000',
      vehicleType: 'Truck',
      assignedRoute: 'David M.',
      status: 'Off-Duty'
    },
    {
      no: 10,
      name: 'Carla G.',
      email: 'info@example.com',
      phone: '000-000-0000',
      licenseNo: '000-000-0000',
      vehicleType: 'Van',
      assignedRoute: 'Carla G.',
      status: 'Active'
    }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Off-Duty':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'On-Delivery':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:w-64`}>
        <Sidebar />
      </div>
      
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full lg:w-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title="All Drivers & Vehicles" />
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="bg-white shadow-sm overflow-hidden">
            
            {/* Add New Button */}
            <div className="px-4 py-3 border-b border-gray-200 flex justify-end">
              <button className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700">
                Add New
              </button>
            </div>
            
            {/* Table with Horizontal Scroll for All Screen Sizes */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-[#003C72] text-white">
                  <tr>
                    <th className="w-12 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">No.</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    <th className="w-28 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">License No.</th>
                    <th className="w-28 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Vehicle Type</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Assigned Route</th>
                    <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {driversData.map((driver, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{driver.no}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 font-medium truncate">{driver.name}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate" title={driver.email}>{driver.email}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{driver.phone}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{driver.licenseNo}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{driver.vehicleType}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{driver.assignedRoute}</td>
                      <td className="px-2 py-2 text-sm truncate">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStatusStyle(driver.status)}`}>
                          {driver.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-sm relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(index);
                          }}
                          className="p-1 rounded hover:bg-gray-100 focus:outline-none"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>
                        
                        {activeDropdown === index && (
                          <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                            <button className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">
                              <UserPlus className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-center space-x-2">
              <button className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm">Prev</button>
              <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium">1</button>
              <button className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm">2</button>
              <button className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm">3</button>
              <span className="text-gray-500 px-2">...</span>
              <button className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm">10</button>
              <button className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriversVehicles;