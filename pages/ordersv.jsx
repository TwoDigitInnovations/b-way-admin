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
      orderId: 'ORD-20943',
      items: 'IV Adventure - Carthe',
      qty: 12,
      pickupLocation: '47 W 13th St, New York',
      deliveryLocation: '20 Cooper Square, New York',
      assignedDriver: 'David M.',
      route: 'Carla G.',
      status: 'Cancelled',
      eta: '2:10 PM'
    },
    {
      no: 2,
      orderId: 'ORD-20943',
      items: 'IV Adventure',
      qty: 20,
      pickupLocation: '20 Cooper Square, New York',
      deliveryLocation: '47 W 13th St, New York',
      assignedDriver: 'Carla G.',
      route: 'David M.',
      status: 'Delivered',
      eta: '8:52 PM'
    },
    {
      no: 3,
      orderId: 'ORD-20943',
      items: 'IV Adventure',
      qty: 15,
      pickupLocation: '47 W 13th St, New York',
      deliveryLocation: '20 Cooper Square, New York',
      assignedDriver: 'David J.',
      route: 'Catrin D.',
      status: 'Picked Up',
      eta: '8:52 AM'
    },
    {
      no: 4,
      orderId: 'ORD-20943',
      items: 'IV Adventure - NCU',
      qty: 10,
      pickupLocation: '20 Cooper Square, New York',
      deliveryLocation: '47 W 13th St, New York',
      assignedDriver: 'Catrin D.',
      route: 'David M.',
      status: 'Scheduled',
      eta: '8:52 PM'
    },
    {
      no: 5,
      orderId: 'ORD-20943',
      items: 'IV Adventure - Carthe',
      qty: 12,
      pickupLocation: '47 W 13th St, New York',
      deliveryLocation: '20 Cooper Square, New York',
      assignedDriver: 'David M.',
      route: 'Carla G.',
      status: 'Return Created',
      eta: '8:52 AM'
    },
    {
      no: 6,
      orderId: 'ORD-20943',
      items: 'IV Osostrutus',
      qty: 50,
      pickupLocation: '20 Cooper Square, New York',
      deliveryLocation: '47 W 13th St, New York',
      assignedDriver: 'Carla G.',
      route: 'David J.',
      status: 'Invoice Generated',
      eta: '8:52 AM'
    },
    {
      no: 7,
      orderId: 'ORD-20943',
      items: 'IV Adventure - Carthe',
      qty: 15,
      pickupLocation: '47 W 13th St, New York',
      deliveryLocation: '20 Cooper Square, New York',
      assignedDriver: 'David J.',
      route: 'Catrin D.',
      status: 'Scheduled',
      eta: '8:52 AM'
    },
    {
      no: 8,
      orderId: 'ORD-20943',
      items: 'IV Adventure',
      qty: 20,
      pickupLocation: '20 Cooper Square, New York',
      deliveryLocation: '47 W 13th St, New York',
      assignedDriver: 'Catrin D.',
      route: 'David M.',
      status: 'Delivered',
      eta: '8:52 AM'
    },
    {
      no: 9,
      orderId: 'ORD-20943',
      items: 'IV Adventure - Carthe',
      qty: 25,
      pickupLocation: '47 W 13th St, New York',
      deliveryLocation: '20 Cooper Square, New York',
      assignedDriver: 'David M.',
      route: 'Carla G.',
      status: 'Cancelled',
      eta: '8:52 AM'
    },
    {
      no: 10,
      orderId: 'ORD-20943',
      items: 'IV Adventure - Carthe',
      qty: 36,
      pickupLocation: '20 Cooper Square, New York',
      deliveryLocation: '47 W 13th St, New York',
      assignedDriver: 'Carla G.',
      route: 'David J.',
      status: 'Delivered',
      eta: '8:52 AM'
    }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Cancelled': 'bg-red-100 text-red-800 border border-red-200',
      'Delivered': 'bg-green-100 text-green-800 border border-green-200',
      'Picked Up': 'bg-blue-100 text-blue-800 border border-blue-200',
      'Scheduled': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'Return Created': 'bg-teal-100 text-teal-800 border border-teal-200',
      'Invoice Generated': 'bg-green-100 text-green-800  border-green-800'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
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
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title="Orders" />
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            
            {/* Table with Horizontal Scroll for All Screen Sizes */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="w-12 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">No.</th>
                    <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                    <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Item(s)</th>
                    <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Qty</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Pickup Location</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Delivery Location</th>
                    <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Assigned Driver</th>
                    <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Route</th>
                    <th className="w-20 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="w-20 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">ETA</th>
                    <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.no}</td>
                      <td className="px-2 py-2 text-sm text-blue-600 font-medium truncate">{order.orderId}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate" title={order.items}>{order.items}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.qty}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.pickupLocation}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.deliveryLocation}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.assignedDriver}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.route}</td>
                      <td className="px-2 py-2 text-sm">{getStatusBadge(order.status)}</td>
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
    <button className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">
      <RotateCcw className="w-4 h-4 mr-2" />
      Create Return
    </button>
    <button className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">
      <Download className="w-4 h-4 mr-2" />
      Download Return Load
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