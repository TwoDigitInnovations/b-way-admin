import React, { useRef, useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit3,
  UserPlus,
  RotateCcw,
  Download,
  X,
  Search,
  Bell,
  ChevronDown,
  Clock,
  Delete,
  DeleteIcon,
  Trash,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import Layout from "@/components/layout";
import isAuth from "@/components/isAuth";

function RoutesSchedules() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    routeName: "",
    startAddress: "",
    startCity: "",
    startState: "",
    startZipcode: "",
    endAddress: "",
    endCity: "",
    endState: "",
    endZipcode: "",
    stops: "",
    assignedDriver: "",
    eta: "",
    activeDays: "",
    status: "",
  });
  const menuRef = useRef(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const routes = [
    {
      no: 1,
      routeName: "Route A - North Bergen",
      startLocation: "47 W 13th St, New York",
      endLocation: "20 Cooper Square, New York",
      stops: "Jammu Hospital",
      assignedDriver: "David M.",
      eta: "2:10 PM",
      activeDays: "Mon-Fri",
      status: "Archive",
    },
    {
      no: 2,
      routeName: "Route B - North Bergen",
      startLocation: "20 Cooper Square, New York",
      endLocation: "47 W 13th St, New York",
      stops: "Capitol Hospital",
      assignedDriver: "Carla G.",
      eta: "8:52 PM",
      activeDays: "Sat only",
      status: "Completed",
    },
    {
      no: 3,
      routeName: "Route C - North Bergen",
      startLocation: "47 W 13th St, New York",
      endLocation: "20 Cooper Square, New York",
      stops: "Jim Pharmacy",
      assignedDriver: "David J.",
      eta: "8:52 AM",
      activeDays: "Mon-Fri",
      status: "Active",
    },
    {
      no: 4,
      routeName: "Route D - North Bergen",
      startLocation: "20 Cooper Square, New York",
      endLocation: "47 W 13th St, New York",
      stops: "Bellevue Hospital",
      assignedDriver: "Catrin D.",
      eta: "8:52 PM",
      activeDays: "Sat only",
      status: "Completed",
    },
    {
      no: 5,
      routeName: "Route A - North Bergen",
      startLocation: "47 W 13th St, New York",
      endLocation: "20 Cooper Square, New York",
      stops: "Oxford Hospital",
      assignedDriver: "David M.",
      eta: "8:52 AM",
      activeDays: "Mon-Fri",
      status: "Archive",
    },
    {
      no: 6,
      routeName: "Route B - North Bergen",
      startLocation: "20 Cooper Square, New York",
      endLocation: "47 W 13th St, New York",
      stops: "Carla G.",
      assignedDriver: "Carla G.",
      eta: "8:52 AM",
      activeDays: "Sat only",
      status: "Active",
    },
    {
      no: 7,
      routeName: "Route C - North Bergen",
      startLocation: "47 W 13th St, New York",
      endLocation: "20 Cooper Square, New York",
      stops: "Capitol Hospital",
      assignedDriver: "David J.",
      eta: "8:52 AM",
      activeDays: "Mon-Fri",
      status: "Archive",
    },
    {
      no: 8,
      routeName: "Route D - North Bergen",
      startLocation: "20 Cooper Square, New York",
      endLocation: "47 W 13th St, New York",
      stops: "Bellevue Hospital",
      assignedDriver: "Catrin D.",
      eta: "8:52 AM",
      activeDays: "Sat only",
      status: "Completed",
    },
    {
      no: 9,
      routeName: "Route A - North Bergen",
      startLocation: "47 W 13th St, New York",
      endLocation: "20 Cooper Square, New York",
      stops: "Jammu Hospital",
      assignedDriver: "David M.",
      eta: "8:52 AM",
      activeDays: "Mon-Fri",
      status: "Archive",
    },
    {
      no: 10,
      routeName: "Route B - North Bergen",
      startLocation: "20 Cooper Square, New York",
      endLocation: "47 W 13th St, New York",
      stops: "Oxford Hospital",
      assignedDriver: "Carla G.",
      eta: "8:52 AM",
      activeDays: "Sat only",
      status: "Completed",
    },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAddModal = () => {
    setEditingRoute(null);
    setFormData({
      routeName: "",
      startAddress: "",
      startCity: "",
      startState: "",
      startZipcode: "",
      endAddress: "",
      endCity: "",
      endState: "",
      endZipcode: "",
      stops: "",
      assignedDriver: "",
      eta: "",
      activeDays: "",
      status: "",
    });
    setShowModal(true);
  };

  const openEditModal = (route) => {
    setEditingRoute(route);

    // Parse start location to extract address and city
    const startLocationParts = route.startLocation.split(",");
    const startAddress = startLocationParts[0]?.trim() || "";
    const startCity = startLocationParts[1]?.trim() || "";

    // Parse end location to extract address and city
    const endLocationParts = route.endLocation.split(",");
    const endAddress = endLocationParts[0]?.trim() || "";
    const endCity = endLocationParts[1]?.trim() || "";

    setFormData({
      routeName: route.routeName || "",
      startAddress: startAddress,
      startCity: startCity,
      startState: startCity === "New York" ? "NY" : "",
      startZipcode: "",
      endAddress: endAddress,
      endCity: endCity,
      endState: endCity === "New York" ? "NY" : "",
      endZipcode: "",
      stops: route.stops || "",
      assignedDriver: route.assignedDriver || "",
      eta: route.eta || "",
      activeDays: route.activeDays || "",
      status: route.status || "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setShowModal(false);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Active: "bg-blue-100 text-blue-800 border border-blue-200",
      Completed: "bg-green-100 text-green-800 border border-green-200",
      Archive: "bg-red-100 text-red-800 border border-red-200",
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

  const getMenuItems = (row) => [
    {
      label: "View",
      icon: <Eye className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("View clicked", row);
      },
    },
    {
      label: "Edit",
      icon: <Edit3 className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("Edit clicked", row);
        openEditModal(row);
      },
    },
    {
      label: "Delete",
      icon: <Trash className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("Delete clicked", row);
      },
    },
  ];

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Layout title="All Routes & Schedules">
      {/* Main Content */}
      <div className="bg-white shadow-sm overflow-hidden rounded-lg">
        {/* Add New Button */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
           <span className="text-lg font-semibold text-gray-900">
            All Routes
          </span>
          <button
            onClick={openAddModal}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700"
          >
            Add New
          </button>
        </div>

        {/* Table with Horizontal Scroll for All Screen Sizes */}
        <DataTable
          value={routes}
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
          rowClassName={() => "hover:bg-gray-50"}
          size="small"
          // style={{ overflow: "visible" }}
          // scrollable={false}
          // columnResizeMode="expand"
          // resizableColumns
          paginator
          rows={10}
          // rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column
            field="no"
            header="No."
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="routeName"
            header="Route Name"
            bodyStyle={{
              color: "#F97316",
              verticalAlign: "middle",
              fontSize: "14px",
            }}
          />
          <Column
            field="startLocation"
            header="Start Location"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="endLocation"
            header="End Location"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="stops"
            header="Stops"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="assignedDriver"
            header="Assigned Driver"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="eta"
            header="ETA"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="activeDays"
            header="Active Days"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="status"
            header="Status"
            body={(rowData) => getStatusBadge(rowData.status)}
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
      </div>
      <Menu
        model={selectedRowData ? getMenuItems(selectedRowData) : []}
        popup
        ref={menuRef}
        id="popup_menu"
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#003C72]">
                {editingRoute
                  ? "Edit Routes & Schedules"
                  : "Add Routes & Schedules"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Route Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Route Name
                </label>
                <input
                  type="text"
                  name="routeName"
                  value={formData.routeName}
                  onChange={handleInputChange}
                  placeholder="Route Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
              </div>

              {/* Start Location */}
              <div>
                <label className="block text-sm font-bold text-[#003C72] mb-2">
                  Start Location
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <input
                      type="text"
                      name="startAddress"
                      value={formData.startAddress}
                      onChange={handleInputChange}
                      placeholder="Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                  </div>
                  <div>
                    <select
                      name="startCity"
                      value={formData.startCity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">Select City</option>
                      <option value="New York">New York</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="Chicago">Chicago</option>
                    </select>
                  </div>
                  <div>
                    <select
                      name="startState"
                      value={formData.startState}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">Select State</option>
                      <option value="NY">New York</option>
                      <option value="CA">California</option>
                      <option value="IL">Illinois</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="startZipcode"
                      value={formData.startZipcode}
                      onChange={handleInputChange}
                      placeholder="Zipcode"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* End Location */}
              <div>
                <label className="block text-sm font-bold text-[#003C72] mb-2">
                  End Location
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <input
                      type="text"
                      name="endAddress"
                      value={formData.endAddress}
                      onChange={handleInputChange}
                      placeholder="Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                  </div>
                  <div>
                    <select
                      name="endCity"
                      value={formData.endCity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">Select City</option>
                      <option value="New York">New York</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="Chicago">Chicago</option>
                    </select>
                  </div>
                  <div>
                    <select
                      name="endState"
                      value={formData.endState}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">Select State</option>
                      <option value="NY">New York</option>
                      <option value="CA">California</option>
                      <option value="IL">Illinois</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="endZipcode"
                      value={formData.endZipcode}
                      onChange={handleInputChange}
                      placeholder="Zipcode"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Stops */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stops
                  </label>
                  <select
                    name="stops"
                    value={formData.stops}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  >
                    <option value="">Select Stops</option>
                    <option value="Jammu Hospital">Jammu Hospital</option>
                    <option value="Capitol Hospital">Capitol Hospital</option>
                    <option value="Bellevue Hospital">Bellevue Hospital</option>
                    <option value="Oxford Hospital">Oxford Hospital</option>
                    <option value="Jim Pharmacy">Jim Pharmacy</option>
                  </select>
                </div>

                {/* Assigned Driver */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Driver
                  </label>
                  <select
                    name="assignedDriver"
                    value={formData.assignedDriver}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  >
                    <option value="">Select Assigned Driver</option>
                    <option value="David M.">David M.</option>
                    <option value="Carla G.">Carla G.</option>
                    <option value="David J.">David J.</option>
                    <option value="Catrin D.">Catrin D.</option>
                  </select>
                </div>

                {/* ETA */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ETA
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="eta"
                      value={formData.eta}
                      onChange={handleInputChange}
                      placeholder="2:10 PM"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Active Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active Days
                  </label>
                  <select
                    name="activeDays"
                    value={formData.activeDays}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  >
                    <option value="">Select Active Days</option>
                    <option value="Mon-Fri">Mon-Fri</option>
                    <option value="Sat only">Sat only</option>
                    <option value="Sun only">Sun only</option>
                    <option value="Mon-Sun">Mon-Sun</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Archive">Archive</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  className="bg-secondary text-white px-6 py-2 rounded-md font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default isAuth(RoutesSchedules);
