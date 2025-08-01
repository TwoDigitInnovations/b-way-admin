import React, { useRef, useState, useEffect } from "react";
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
  Trash,
  Clock,
  Plus,
  Check,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import Layout from "@/components/layout";
import isAuth from "@/components/isAuth";

function AddEditModal({ isOpen, onClose, mode, facility, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNo: "",
    vehicleType: "",
    assignedRoute: "",
    status: "",
  });

  useEffect(() => {
    if (mode === "edit" && facility) {
      setFormData({
        name: facility.name || "",
        email: facility.email || "",
        phone: facility.phone || "",
        licenseNo: facility.licenseNo || "",
        vehicleType: facility.vehicleType || "",
        assignedRoute: facility.assignedRoute || "",
        status: facility.status || "",
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: "",
        email: "",
        phone: "",
        licenseNo: "",
        vehicleType: "",
        assignedRoute: "",
        status: "",
      });
    }
  }, [mode, facility, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opavehicleType-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#003C72]">
            {mode === "add"
              ? "Add Drivers & Vehicles"
              : "Edit Drivers & Vehicles"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Row 1 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="enail"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            {/* Row 2 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Licence No.
              </label>
              <input
                type="text"
                name="licence"
                value={formData.licenseNo}
                onChange={handleInputChange}
                placeholder="Licence No."
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            {/* Row 3 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Type
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
                required
              >
                <option value="">Select Vehicle</option>
                <option value="Van">Van</option>
                <option value="Car">Car</option>
                <option value="Truck">Truck</option>
                <option value="Bike">Bike</option>
                <option value="Bus">Bus</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Assigned Route
              </label>
              <select
                name="assignedRoute"
                value={formData.assignedRoute}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
                required
              >
                <option value="">Select Assigned Route</option>
                <option value="David M.">David M.</option>
                <option value="Carla G.">Carla G.</option>
                <option value="David J.">David J.</option>
                <option value="Catrin D.">Catrin D.</option>
                <option value="John S.">John S.</option>
                <option value="Alice B.">Alice B.</option>
                <option value="Michael T.">Michael T.</option>
                <option value="Sarah L.">Sarah L.</option>
                <option value="Emily R.">Emily R.</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
                required
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Off-Duty">Off-Duty</option>
                <option value="On-Delivery">On-Delivery</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
                <option value="Retired">Retired</option>
                <option value="On-Hold">On-Hold</option>
                <option value="Under Review">Under Review</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="bg-secondary hover:bg-secondary text-white px-8 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DriversVehicles() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedFacility, setSelectedFacility] = useState(null);

  const handleModalSubmit = (formData) => {
    if (modalMode === "add") {
      const newFacility = {
        ...formData,
        no: facilities.length + 1,
      };
      // setFacilities([...facilities, newFacility]);
    } else if (modalMode === "edit" && selectedFacility) {
      // setFacilities(
      //   facilities.map((f) =>
      //     f.no === selectedFacility.no
      //       ? { ...formData, no: selectedFacility.no }
      //       : f
      //   )
      // );
    }
  };

  const handleEdit = (facility) => {
    setModalMode("edit");
    setSelectedFacility(facility);
    setModalOpen(true);
    setActiveDropdown(null);
  };

    const handleAddNew = () => {
    setModalMode("add");
    setSelectedFacility(null);
    setModalOpen(true);
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
        handleEdit(row);
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

  const driversData = [
    {
      no: 1,
      name: "David M.",
      email: "info@example.com",
      phone: "000-000-0000",
      licenseNo: "000-000-0000",
      vehicleType: "Van",
      assignedRoute: "David M.",
      status: "Off-Duty",
    },
    {
      no: 2,
      name: "Carla G.",
      email: "info@example.com",
      phone: "000-000-0000",
      licenseNo: "000-000-0000",
      vehicleType: "Car",
      assignedRoute: "Carla G.",
      status: "Active",
    },
    {
      no: 3,
      name: "David M.",
      email: "info@example.com",
      phone: "000-000-0000",
      licenseNo: "000-000-0000",
      vehicleType: "Truck",
      assignedRoute: "David J.",
      status: "On-Delivery",
    },
    {
      no: 4,
      name: "Carla G.",
      email: "info@example.com",
      phone: "000-000-0000",
      licenseNo: "000-000-0000",
      vehicleType: "Van",
      assignedRoute: "Catrin D.",
      status: "Active",
    },
    {
      no: 5,
      name: "David M.",
      email: "info@example.com",
      phone: "000-000-0000",
      licenseNo: "000-000-0000",
      vehicleType: "Car",
      assignedRoute: "David M.",
      status: "Off-Duty",
    },
    {
      no: 6,
      name: "Carla G.",
      email: "info@example.com",
      phone: "000-000-0000",
      licenseNo: "000-000-0000",
      vehicleType: "Truck",
      assignedRoute: "Carla G.",
      status: "On-Delivery",
    },
    {
      no: 7,
      name: "David M.",
      email: "info@example.com",
      phone: "000-000-0000",
      licenseNo: "000-000-0000",
      vehicleType: "Van",
      assignedRoute: "David J.",
      status: "Off-Duty",
    },
    {
      no: 8,
      name: "Carla G.",
      email: "info@example.com",
      phone: "000-000-0000",
      licenseNo: "000-000-0000",
      vehicleType: "Car",
      assignedRoute: "Catrin D.",
      status: "Active",
    },
    {
      no: 9,
      name: "David M.",
      email: "info@example.com",
      phone: "000-000-0000",
      licenseNo: "000-000-0000",
      vehicleType: "Truck",
      assignedRoute: "David M.",
      status: "Off-Duty",
    },
    {
      no: 10,
      name: "Carla G.",
      email: "info@example.com",
      phone: "000-000-0000",
      licenseNo: "000-000-0000",
      vehicleType: "Van",
      assignedRoute: "Carla G.",
      status: "Active",
    },
  ];

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Active: "bg-green-100 text-green-800 border border-green-200",
      "Off-Duty": "bg-red-100 text-red-800 border border-red-200",
      "On-Delivery": "bg-blue-100 text-blue-800 border border-blue-200",
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

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Layout title="All Drivers & Vehicles">
      {/* Main Content */}
      <div className="bg-white shadow-sm overflow-hidden rounded-lg">
        {/* Add New Button */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            All Drivers
          </span>
          <button
            onClick={handleAddNew}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700"
          >
            Add New
          </button>
        </div>

        {/* Table with Horizontal Scroll for All Screen Sizes */}
        <DataTable
          value={driversData}
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
            field="name"
            header="Name"
            bodyStyle={{
              verticalAlign: "middle",
              fontSize: "14px",
            }}
          />
          <Column
            field="email"
            header="Email"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="phone"
            header="Phone"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="licenseNo"
            header="License No."
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="vehicleType"
            header="Vehicle Type"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="assignedRoute"
            header="Assigned Route"
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

      <AddEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        facility={selectedFacility}
        onSubmit={handleModalSubmit}
      />
    </Layout>
  );
}

export default isAuth(DriversVehicles);
