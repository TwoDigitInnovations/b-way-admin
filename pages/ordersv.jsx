import React, { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit3,
  UserPlus,
  RotateCcw,
  Download,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  Clock,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Layout from "@/components/layout";
import { Button } from "primereact/button";

function Orders() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const orders = [
    {
      no: 1,
      orderId: "ORD-20943",
      items: "IV Adventure - Carthe",
      qty: 12,
      pickupLocation: "47 W 13th St, New York",
      deliveryLocation: "20 Cooper Square, New York",
      assignedDriver: "David M.",
      route: "Carla G.",
      status: "Cancelled",
      eta: "2:10 PM",
    },
    {
      no: 2,
      orderId: "ORD-20943",
      items: "IV Adventure",
      qty: 20,
      pickupLocation: "20 Cooper Square, New York",
      deliveryLocation: "47 W 13th St, New York",
      assignedDriver: "Carla G.",
      route: "David M.",
      status: "Delivered",
      eta: "8:52 PM",
    },
    {
      no: 3,
      orderId: "ORD-20943",
      items: "IV Adventure",
      qty: 15,
      pickupLocation: "47 W 13th St, New York",
      deliveryLocation: "20 Cooper Square, New York",
      assignedDriver: "David J.",
      route: "Catrin D.",
      status: "Picked Up",
      eta: "8:52 AM",
    },
    {
      no: 4,
      orderId: "ORD-20943",
      items: "IV Adventure - NCU",
      qty: 10,
      pickupLocation: "20 Cooper Square, New York",
      deliveryLocation: "47 W 13th St, New York",
      assignedDriver: "Catrin D.",
      route: "David M.",
      status: "Scheduled",
      eta: "8:52 PM",
    },
    {
      no: 5,
      orderId: "ORD-20943",
      items: "IV Adventure - Carthe",
      qty: 12,
      pickupLocation: "47 W 13th St, New York",
      deliveryLocation: "20 Cooper Square, New York",
      assignedDriver: "David M.",
      route: "Carla G.",
      status: "Return Created",
      eta: "8:52 AM",
    },
    {
      no: 6,
      orderId: "ORD-20943",
      items: "IV Osostrutus",
      qty: 50,
      pickupLocation: "20 Cooper Square, New York",
      deliveryLocation: "47 W 13th St, New York",
      assignedDriver: "Carla G.",
      route: "David J.",
      status: "Invoice Generated",
      eta: "8:52 AM",
    },
    {
      no: 7,
      orderId: "ORD-20943",
      items: "IV Adventure - Carthe",
      qty: 15,
      pickupLocation: "47 W 13th St, New York",
      deliveryLocation: "20 Cooper Square, New York",
      assignedDriver: "David J.",
      route: "Catrin D.",
      status: "Scheduled",
      eta: "8:52 AM",
    },
    {
      no: 8,
      orderId: "ORD-20943",
      items: "IV Adventure",
      qty: 20,
      pickupLocation: "20 Cooper Square, New York",
      deliveryLocation: "47 W 13th St, New York",
      assignedDriver: "Catrin D.",
      route: "David M.",
      status: "Delivered",
      eta: "8:52 AM",
    },
    {
      no: 9,
      orderId: "ORD-20943",
      items: "IV Adventure - Carthe",
      qty: 25,
      pickupLocation: "47 W 13th St, New York",
      deliveryLocation: "20 Cooper Square, New York",
      assignedDriver: "David M.",
      route: "Carla G.",
      status: "Cancelled",
      eta: "8:52 AM",
    },
    {
      no: 10,
      orderId: "ORD-20943",
      items: "IV Adventure - Carthe",
      qty: 36,
      pickupLocation: "20 Cooper Square, New York",
      deliveryLocation: "47 W 13th St, New York",
      assignedDriver: "Carla G.",
      route: "David J.",
      status: "Delivered",
      eta: "8:52 AM",
    },
  ];

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Cancelled: "bg-red-100 text-red-800 border border-red-200",
      Delivered: "bg-green-100 text-green-800 border border-green-200",
      "Picked Up": "bg-blue-100 text-blue-800 border border-blue-200",
      Scheduled: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      "Return Created": "bg-teal-100 text-teal-800 border border-teal-200",
      "Invoice Generated": "bg-green-100 text-green-800  border-green-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Layout title="Orders">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table with Horizontal Scroll for All Screen Sizes */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="w-12 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  No.
                </th>
                <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Order ID
                </th>
                <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Item(s)
                </th>
                <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Qty
                </th>
                <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Pickup Location
                </th>
                <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Delivery Location
                </th>
                <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Assigned Driver
                </th>
                <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Route
                </th>
                <th className="w-20 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="w-20 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  ETA
                </th>
                <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">
                    {order.no}
                  </td>
                  <td className="px-2 py-2 text-sm text-orange-500 font-medium truncate">
                    {order.orderId}
                  </td>
                  <td
                    className="px-2 py-2 text-sm text-gray-900 truncate"
                    title={order.items}
                  >
                    {order.items}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">
                    {order.qty}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">
                    {order.pickupLocation}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">
                    {order.deliveryLocation}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">
                    {order.assignedDriver}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">
                    {order.route}
                  </td>
                  <td className="px-2 py-2 text-sm">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-2 py-2 text-sm text-gray-900 truncate">
                    {order.eta}
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
                        <button
                          onClick={() => handleEditClick(order)}
                          className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                        >
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
          <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium">
            1
          </button>
          <button className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm">
            2
          </button>
          <button className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm">
            3
          </button>
          <span className="text-gray-500 px-2">...</span>
          <button className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm">
            10
          </button>
          <button className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm">
            Next
          </button>
        </div>
      </div>

      {/* Edit Order Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Order
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              {/* Item(S) and Qty Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item(S)
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                    <option>Select Item(S)</option>
                    <option selected>{selectedOrder?.items}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qty
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedOrder?.qty}
                    placeholder="Qty"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Route
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                    <option>Select Route</option>
                    <option selected>{selectedOrder?.route}</option>
                  </select>
                </div>
              </div>

              {/* Pickup Location Section */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-[#003C72] mb-3">
                  Pickup Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedOrder?.pickupLocation}
                      placeholder="Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                      <option>Select City</option>
                      <option selected>New York</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                      <option>Select State</option>
                      <option selected>NY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zipcode
                    </label>
                    <input
                      type="text"
                      placeholder="Zipcode"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Location Section */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-[#003C72] mb-3">
                  Delivery Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedOrder?.deliveryLocation}
                      placeholder="Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                      <option>Select City</option>
                      <option selected>New York</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                      <option>Select State</option>
                      <option selected>NY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zipcode
                    </label>
                    <input
                      type="text"
                      placeholder="Zipcode"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Row - Assigned Driver, ETA, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Driver
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                    <option>Select Assigned Driver</option>
                    <option selected>{selectedOrder?.assignedDriver}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ETA
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue={selectedOrder?.eta}
                      placeholder="2:10 PM"
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                    />
                    <Clock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                    <option>Select Status</option>
                    <option selected={selectedOrder?.status === "Cancelled"}>
                      Cancelled
                    </option>
                    <option selected={selectedOrder?.status === "Delivered"}>
                      Delivered
                    </option>
                    <option selected={selectedOrder?.status === "Picked Up"}>
                      Picked Up
                    </option>
                    <option selected={selectedOrder?.status === "Scheduled"}>
                      Scheduled
                    </option>
                    <option
                      selected={selectedOrder?.status === "Return Created"}
                    >
                      Return Created
                    </option>
                    <option
                      selected={selectedOrder?.status === "Invoice Generated"}
                    >
                      Invoice Generated
                    </option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-start">
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Orders;
