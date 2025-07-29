import React, { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit3,
  UserPlus,
  RotateCcw,
  Download,
  // Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  Clock,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Layout from "@/components/layout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Api } from "@/helper/service";
import { useRouter } from "next/router";

function Orders({ loader }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const menuRef = useRef(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [orders, setOrders] = useState([]);
  // Pagination
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const router = useRouter();

  const getMenuItems = (order) => [
    {
      label: "View",
      icon: <Eye className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("View clicked", order);
      },
    },
    {
      label: "Edit",
      icon: <Edit3 className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("Edit clicked", order);
        handleEditClick(order);
      },
    },
    {
      label: "Assign",
      icon: <UserPlus className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("Assign clicked", order);
      },
    },
    {
      label: "Create Return",
      icon: <RotateCcw className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("Create Return clicked", order);
      },
    },
    {
      label: "Download Return Load",
      icon: <Download className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("Download Return Load clicked", order);
      },
    },
  ];

  const toggleDropdown = (index, event) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      if (event) {
        const rect = event.target.getBoundingClientRect();
        setDropdownPosition({
          x: rect.right - 192, // 192px = width of dropdown (w-48)
          y: rect.bottom + 8,
        });
      }
      setActiveDropdown(index);
    }
  };

  const tempOrders = [
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
    {
      no: 11,
      orderId: "ORD-56545",
      items: "IV Adventure - Alok",
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

  const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown-menu")) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      loader(true);
      try {
        const response = await Api(
          "GET",
          `/order?page=${currentPage}&limit=${limit}`,
          null,
          router
        );

        if (response.status) {
          setOrders(response.data);
          setTotalOrders(response.totalOrders);
          setCurrentPage(response.currentPage);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        loader(false);
      }
    };

    fetchOrders();
  }, [currentPage, limit]);

  const handlePageChange = (event) => {
    setCurrentPage(event.page + 1);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Cancelled: "bg-red-100 text-red-800 border border-red-200",
      Delivered: "bg-green-100 text-green-800 border border-green-200",
      "Picked Up": "bg-blue-100 text-blue-800 border border-blue-200",
      Scheduled: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      "Return Created": "bg-teal-100 text-teal-800 border border-teal-200",
      "Invoice Generated": "bg-green-100 text-green-800  border-green-800",
      Pending: "bg-gray-100 text-gray-800 border border-gray-200",
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

  return (
    <Layout title="Orders">
      <div className="bg-white shadow-sm overflow-hidden rounded-lg">
        <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            All Orders
          </span>
          {/* <button className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700">
            Add New
          </button> */}
        </div>
        <DataTable
          value={orders}
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
          rowClassName={() => "hover:bg-gray-50"}
          size="small"
          paginator
          rows={limit}
          totalRecords={totalOrders}
          first={(currentPage - 1) * limit}
          lazy
          onPage={handlePageChange}
        >
          <Column
            field="index"
            header="No."
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="orderId"
            header="Order ID"
            bodyStyle={{
              color: "#F97316",
              fontWeight: 500,
              verticalAlign: "middle",
              fontSize: "14px",
            }}
          />
          <Column
            field="items"
            header="Item(s)"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="qty"
            header="Qty"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="pickupLocation"
            header="Pickup Location"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="deliveryLocation"
            header="Delivery Location"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="assignedDriver"
            header="Assigned Driver"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => <span>{rowData?.assignedDriver?.name}</span>}
          />
          <Column
            field="route"
            header="Route"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => <span>{rowData?.route?.routeName}</span>}
          />
          <Column
            field="status"
            header="Status"
            body={(rowData) => getStatusBadge(rowData.status)}
          />
          <Column
            field="eta"
            header="ETA"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            header="Action"
            bodyStyle={{
              verticalAlign: "middle",
              textAlign: "center",
              overflow: "visible",
              position: "relative",
            }}
            body={(rowData, options) => (
              <div className="relative flex justify-center">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSelectedRowData(rowData);
                    menuRef.current.toggle(event);
                  }}
                  className="p-1 rounded hover:bg-gray-100 focus:outline-none"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}
          />
        </DataTable>

        {/* Pagination */}
        {/* <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-center space-x-2">
          <button className="bg-secondary text-white px-3 py-1 rounded text-sm font-medium">
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
        </div> */}
      </div>
      <Menu
        model={selectedRowData ? getMenuItems(selectedRowData) : []}
        popup
        ref={menuRef}
        id="popup_menu"
      />

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
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Route
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                    <option>Select Route</option>
                    <option selected>{selectedOrder?.route?.routeName}</option>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                      <option>Select City</option>
                      <option selected>New York</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                      <option>Select City</option>
                      <option selected>New York</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
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
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                    <option>Select Assigned Driver</option>
                    <option selected>{selectedOrder?.assignedDriver?.name}</option>
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
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
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
                <button className="bg-secondary hover:bg-secondary text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors">
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
