import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Eye, Edit3, UserPlus, RotateCcw, Download, Menu, X, Search, Bell, ChevronDown, Wifi, WifiOff } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { useSocket } from '@/contexts/SocketContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

function Orders() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiOrders, setApiOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  
  // Get socket context
  const { isConnected, orders: realtimeOrders, setOrders } = useSocket();

  // Get status color helper
  const getStatusColor = (status) => {
    const statusColors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Active: 'bg-green-100 text-green-800',
      Delivered: 'bg-green-100 text-green-800',
      'Picked Up': 'bg-blue-100 text-blue-800',
      Scheduled: 'bg-yellow-100 text-yellow-800',
      Cancelled: 'bg-red-100 text-red-800',
      Hold: 'bg-red-100 text-red-800',
      'Return Created': 'bg-teal-100 text-teal-800',
      'Invoice Generated': 'bg-green-100 text-green-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // Fetch orders from API
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const token = Cookies.get('userToken');
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setApiOrders(response.data.data);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setTotalOrders(response.data.totalOrders);
        
        // Set initial orders in socket context if empty
        if (realtimeOrders.length === 0) {
          setOrders(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, realtimeOrders]);

  const mergedOrders = React.useMemo(() => {
   console.log("Combining orders:", {
      realtimeOrdersCount: realtimeOrders.length,
      apiOrdersCount: apiOrders.length,
      realtimeOrders: realtimeOrders,
      apiOrders: apiOrders,
    });

    const realtimeOrderIds = new Set(realtimeOrders.map((order) => order._id));
    const filteredRecentOrders = apiOrders.filter(
      (order) => !realtimeOrderIds.has(order._id)
    );
    const combined = [...realtimeOrders, ...filteredRecentOrders];

    console.log("Combined orders result:", {
      combinedCount: combined.length,
      finalOrders: combined,
    });

    return combined.slice(0, 6);
  }, [realtimeOrders, apiOrders]);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const orders = mergedOrders;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:w-64`}>
        <Sidebar />
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 w-full lg:w-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title="Orders" />
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {realtimeOrders.length > 0 && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {realtimeOrders.length} live order{realtimeOrders.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            <button
              onClick={() => fetchOrders(currentPage)}
              className="flex items-center space-x-2 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="bg-white shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-2">Loading orders...</span>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-[#003C72] text-white">
                      <tr>
                        <th className="w-12 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">No.</th>
                        <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Facility Name</th>
                        <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                        <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Item(s)</th>
                        <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Qty</th>
                        <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                        <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Route</th>
                        <th className="w-20 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">ETA</th>
                        <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mergedOrders.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        mergedOrders.map((order, index) => (
                          <tr 
                            key={order._id || index} 
                            className={`hover:bg-gray-50 ${
                              realtimeOrders.some(ro => ro._id === order._id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <td className="px-2 py-2 text-sm text-gray-900 truncate">{index + 1}</td>
                            <td className="px-2 py-2 text-sm text-orange-500 font-medium truncate">
                              {order.user?.name || order.hospitalName || 'Unknown Hospital'}
                            </td>
                            <td className="px-2 py-2 text-sm text-blue-600 font-medium truncate">{order.orderId}</td>
                            <td className="px-2 py-2 text-sm text-gray-900 truncate" title={order.items?.name || order.items}>
                              {order.items?.name || order.items || 'N/A'}
                            </td>
                            <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.qty}</td>
                            <td className="px-2 py-2 text-sm truncate">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-2 py-2 text-sm text-gray-900 truncate">
                              {order.route?.routeName || 'Unassigned'}
                            </td>
                            <td className="px-2 py-2 text-sm text-gray-900 truncate">{order.eta || 'N/A'}</td>
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
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalOrders)} of {totalOrders} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button 
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            currentPage === page 
                              ? 'bg-orange-500 text-white' 
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        <span className="text-gray-500 px-2">...</span>
                        <button 
                          onClick={() => handlePageChange(totalPages)}
                          className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;