import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit3, UserPlus, RotateCcw, Download, Menu, X, Search, Bell, ChevronDown } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

function Orders() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const orders = [
    {
      no: 1,
      facilityName: 'NYU Langone',
      orderId: 'ORD-20943',
      items: 'IV Adminture - Carthe',
      qty: 12,
      assignedDriver: 'David M.',
      route: 'Carla G.',
      eta: '2:10 PM'
    },
    {
      no: 2,
      facilityName: 'Columbia Peds',
      orderId: 'ORD-20943',
      items: 'IV Adminture',
      qty: 20,
      assignedDriver: 'Carla G.',
      route: 'David M.',
      eta: '8:52 PM'
    },
    {
      no: 3,
      facilityName: 'Oxford Hospital',
      orderId: 'ORD-20943',
      items: 'IV Adminture',
      qty: 15,
      assignedDriver: 'David J.',
      route: 'Catrin D.',
      eta: '8:52 AM'
    },
    {
      no: 4,
      facilityName: 'Jammu Hospital',
      orderId: 'ORD-20943',
      items: 'IV Adminture - NCU',
      qty: 10,
      assignedDriver: 'Catrin D.',
      route: 'David M.',
      eta: '8:52 PM'
    },
    {
      no: 5,
      facilityName: 'Bellevue Hospital',
      orderId: 'ORD-20943',
      items: 'IV Adminture - Carthe',
      qty: 12,
      assignedDriver: 'David M.',
      route: 'Carla G.',
      eta: '8:52 AM'
    },
    {
      no: 6,
      facilityName: 'Retarice Lospit',
      orderId: 'ORD-20943',
      items: 'IV Osortorua',
      qty: 50,
      assignedDriver: 'Carla G.',
      route: 'David J.',
      eta: '8:52 AM'
    },
    {
      no: 7,
      facilityName: 'Oxford Hospital',
      orderId: 'ORD-20943',
      items: 'IV Adminture - Carthe',
      qty: 15,
      assignedDriver: 'David J.',
      route: 'Catrin D.',
      eta: '8:52 AM'
    },
    {
      no: 8,
      facilityName: 'Jammu Hospital',
      orderId: 'ORD-20943',
      items: 'IV Adminture',
      qty: 20,
      assignedDriver: 'Catrin D.',
      route: 'David M.',
      eta: '8:52 AM'
    },
    {
      no: 9,
      facilityName: 'NYU Langone',
      orderId: 'ORD-20943',
      items: 'IV Adminture - Carthe',
      qty: 25,
      assignedDriver: 'David M.',
      route: 'Carla G.',
      eta: '8:52 AM'
    },
    {
      no: 10,
      facilityName: 'Columbia Peds',
      orderId: 'ORD-20943',
      items: 'IV Adminture - Carthe',
      qty: 36,
      assignedDriver: 'Carla G.',
      route: 'David J.',
      eta: '8:52 AM'
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
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title="Orders" />
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="bg-white  shadow-sm overflow-hidden">
            
            {/* Table with Horizontal Scroll for All Screen Sizes */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-[#003C72] text-white">
                  <tr>
                    <th className="w-12 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">No.</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Facility Name</th>
                    <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                    <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Item(s)</th>
                    <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Qty</th>
                    <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Assigned Driver</th>
                    <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Route</th>
                    <th className="w-20 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">ETA</th>
                    <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.no}</td>
                      <td className="px-2 py-2 text-sm text-orange-500 font-medium truncate">{order.facilityName}</td>
                      <td className="px-2 py-2 text-sm text-blue-600 font-medium truncate">{order.orderId}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate" title={order.items}>{order.items}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.qty}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.assignedDriver}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.route}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.eta}</td>
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
                              Assign
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

export default Orders;