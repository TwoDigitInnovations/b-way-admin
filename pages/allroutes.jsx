import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit3, UserPlus, RotateCcw, Download, Menu, X, Search, Bell, ChevronDown } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

function RoutesSchedules() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const routes = [
    {
      no: 1,
      routeName: 'Route A - North Bergen',
      startLocation: '47 W 13th St, New York',
      endLocation: '20 Cooper Square, New York',
      stops: 'Jammu Hospital',
      assignedDriver: 'David M.',
      eta: '2:10 PM',
      activeDays: 'Mon-Fri',
      status: 'Archive'
    },
    {
      no: 2,
      routeName: 'Route B - North Bergen',
      startLocation: '20 Cooper Square, New York',
      endLocation: '47 W 13th St, New York',
      stops: 'Capitol Hospital',
      assignedDriver: 'Carla G.',
      eta: '8:52 PM',
      activeDays: 'Sat only',
      status: 'Completed'
    },
    {
      no: 3,
      routeName: 'Route C - North Bergen',
      startLocation: '47 W 13th St, New York',
      endLocation: '20 Cooper Square, New York',
      stops: 'Jim Pharmacy',
      assignedDriver: 'David J.',
      eta: '8:52 AM',
      activeDays: 'Mon-Fri',
      status: 'Active'
    },
    {
      no: 4,
      routeName: 'Route D - North Bergen',
      startLocation: '20 Cooper Square, New York',
      endLocation: '47 W 13th St, New York',
      stops: 'Bellevue Hospital',
      assignedDriver: 'Catrin D.',
      eta: '8:52 PM',
      activeDays: 'Sat only',
      status: 'Completed'
    },
    {
      no: 5,
      routeName: 'Route A - North Bergen',
      startLocation: '47 W 13th St, New York',
      endLocation: '20 Cooper Square, New York',
      stops: 'Oxford Hospital',
      assignedDriver: 'David M.',
      eta: '8:52 AM',
      activeDays: 'Mon-Fri',
      status: 'Archive'
    },
    {
      no: 6,
      routeName: 'Route B - North Bergen',
      startLocation: '20 Cooper Square, New York',
      endLocation: '47 W 13th St, New York',
      stops: 'Carla G.',
      assignedDriver: 'Carla G.',
      eta: '8:52 AM',
      activeDays: 'Sat only',
      status: 'Active'
    },
    {
      no: 7,
      routeName: 'Route C - North Bergen',
      startLocation: '47 W 13th St, New York',
      endLocation: '20 Cooper Square, New York',
      stops: 'Capitol Hospital',
      assignedDriver: 'David J.',
      eta: '8:52 AM',
      activeDays: 'Mon-Fri',
      status: 'Archive'
    },
    {
      no: 8,
      routeName: 'Route D - North Bergen',
      startLocation: '20 Cooper Square, New York',
      endLocation: '47 W 13th St, New York',
      stops: 'Bellevue Hospital',
      assignedDriver: 'Catrin D.',
      eta: '8:52 AM',
      activeDays: 'Sat only',
      status: 'Completed'
    },
    {
      no: 9,
      routeName: 'Route A - North Bergen',
      startLocation: '47 W 13th St, New York',
      endLocation: '20 Cooper Square, New York',
      stops: 'Jammu Hospital',
      assignedDriver: 'David M.',
      eta: '8:52 AM',
      activeDays: 'Mon-Fri',
      status: 'Archive'
    },
    {
      no: 10,
      routeName: 'Route B - North Bergen',
      startLocation: '20 Cooper Square, New York',
      endLocation: '47 W 13th St, New York',
      stops: 'Oxford Hospital',
      assignedDriver: 'Carla G.',
      eta: '8:52 AM',
      activeDays: 'Sat only',
      status: 'Completed'
    }
  ];

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'archive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title="All Routes & Schedules" />
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
                    <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Route Name</th>
                    <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Start Location</th>
                    <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">End Location</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Stops</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Assigned Driver</th>
                    <th className="w-20 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">ETA</th>
                    <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Active Days</th>
                    <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {routes.map((route, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{route.no}</td>
                      <td className="px-2 py-2 text-sm text-orange-500 font-medium truncate">{route.routeName}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate" title={route.startLocation}>{route.startLocation}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate" title={route.endLocation}>{route.endLocation}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{route.stops}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{route.assignedDriver}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{route.eta}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{route.activeDays}</td>
                      <td className="px-2 py-2 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                          {route.status}
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

export default RoutesSchedules;