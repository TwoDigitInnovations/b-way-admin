import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit3, UserPlus, RotateCcw, Download, Menu, X, Search, Bell, ChevronDown } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

function HospitalsFacilities() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const facilities = [
    {
      no: 1,
      hospitalName: 'Jammu Hospital',
      address: '47 W 13th St, New York',
      contactPerson: 'David M.',
      phone: '000-000-0000',
      assignedRoute: 'David M.',
      deliveryWindow: '2PM-6PM',
      type: 'Hospital'
    },
    {
      no: 2,
      hospitalName: 'Columbia Peds',
      address: '20 Cooper Square, New York',
      contactPerson: 'Carla G.',
      phone: '000-000-0000',
      assignedRoute: 'Carla G.',
      deliveryWindow: '2PM-6PM',
      type: 'Pharmacy'
    },
    {
      no: 3,
      hospitalName: 'Oxford Hospital',
      address: '47 W 13th St, New York',
      contactPerson: 'David M.',
      phone: '000-000-0000',
      assignedRoute: 'David J.',
      deliveryWindow: '2PM-6PM',
      type: 'Clinic'
    },
    {
      no: 4,
      hospitalName: 'Jammu Hospital',
      address: '20 Cooper Square, New York',
      contactPerson: 'Carla G.',
      phone: '000-000-0000',
      assignedRoute: 'Catrin D.',
      deliveryWindow: '2PM-6PM',
      type: 'Hospital'
    },
    {
      no: 5,
      hospitalName: 'Bellevue Hospital',
      address: '47 W 13th St, New York',
      contactPerson: 'David M.',
      phone: '000-000-0000',
      assignedRoute: 'David M.',
      deliveryWindow: '2PM-6PM',
      type: 'Pharmacy'
    },
    {
      no: 6,
      hospitalName: 'Retarice Lospit',
      address: '20 Cooper Square, New York',
      contactPerson: 'Carla G.',
      phone: '000-000-0000',
      assignedRoute: 'Carla G.',
      deliveryWindow: '2PM-6PM',
      type: 'Clinic'
    },
    {
      no: 7,
      hospitalName: 'Oxford Hospital',
      address: '47 W 13th St, New York',
      contactPerson: 'David M.',
      phone: '000-000-0000',
      assignedRoute: 'David J.',
      deliveryWindow: '2PM-6PM',
      type: 'Hospital'
    },
    {
      no: 8,
      hospitalName: 'Jammu Hospital',
      address: '20 Cooper Square, New York',
      contactPerson: 'Carla G.',
      phone: '000-000-0000',
      assignedRoute: 'Catrin D.',
      deliveryWindow: '2PM-6PM',
      type: 'Pharmacy'
    },
    {
      no: 9,
      hospitalName: 'NYU Langone',
      address: '47 W 13th St, New York',
      contactPerson: 'David M.',
      phone: '000-000-0000',
      assignedRoute: 'David M.',
      deliveryWindow: '2PM-6PM',
      type: 'Clinic'
    },
    {
      no: 10,
      hospitalName: 'Columbia Peds',
      address: '20 Cooper Square, New York',
      contactPerson: 'Carla G.',
      phone: '000-000-0000',
      assignedRoute: 'Carla G.',
      deliveryWindow: '2PM-6PM',
      type: 'Hospital'
    }
  ];

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
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title="All Hospitals & Facilities" />
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
                    <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Hospital Name</th>
                    <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Address</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact Person</th>
                    <th className="w-28 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Assigned Route</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Delivery Window</th>
                    <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                    <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facilities.map((facility, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{facility.no}</td>
                      <td className="px-2 py-2 text-sm text-orange-500 font-medium truncate">{facility.hospitalName}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate" title={facility.address}>{facility.address}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{facility.contactPerson}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{facility.phone}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{facility.assignedRoute}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{facility.deliveryWindow}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{facility.type}</td>
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

export default HospitalsFacilities;