import React, { useState, useEffect, useRef } from "react";
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
import { Api } from "@/helper/service";

// Add/Edit Modal Component
function AddEditModal({ isOpen, onClose, mode, facility, onSubmit }) {
  const [formData, setFormData] = useState({
    hospitalName: "",
    contactPerson: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    assignedRoute: "",
    deliveryWindow: "",
    type: "",
  });

  useEffect(() => {
    if (mode === "edit" && facility) {
      setFormData({
        hospitalName: facility.hospitalName || "",
        contactPerson: facility.contactPerson || "",
        phone: facility.phone || "",
        address: facility.address || "",
        city: "",
        state: "",
        zipcode: "",
        assignedRoute: facility.assignedRoute || "",
        deliveryWindow: facility.deliveryWindow || "",
        type: facility.type || "",
      });
    } else {
      // Reset form for add mode
      setFormData({
        hospitalName: "",
        contactPerson: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
        assignedRoute: "",
        deliveryWindow: "",
        type: "",
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
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#003C72]">
            {mode === "add" ? "Add Hospital" : "Edit Hospital"}
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
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Contact Person
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="Contact Person"
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
            <div className="space-y-2 md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            {/* Row 3 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
                required
              >
                <option value="">Select City</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Houston">Houston</option>
                <option value="Phoenix">Phoenix</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
                required
              >
                <option value="">Select State</option>
                <option value="NY">New York</option>
                <option value="CA">California</option>
                <option value="IL">Illinois</option>
                <option value="TX">Texas</option>
                <option value="AZ">Arizona</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Zipcode
              </label>
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleInputChange}
                placeholder="Zipcode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            {/* Row 4 */}
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
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Delivery Window
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="deliveryWindow"
                  value={formData.deliveryWindow}
                  onChange={handleInputChange}
                  placeholder="2PM-6PM"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                  required
                />
                <Clock className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
                required
              >
                <option value="">Select Type</option>
                <option value="Hospital">Hospital</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Clinic">Clinic</option>
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

// Main Component
function HospitalsFacilities({ loader }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  const menuRef = useRef(null);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [facilities, setFacilities] = useState([]);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  const handleAddNew = () => {
    setModalMode("add");
    setSelectedFacility(null);
    setModalOpen(true);
  };

  const handleEdit = (facility) => {
    setModalMode("edit");
    setSelectedFacility(facility);
    setModalOpen(true);
    setActiveDropdown(null);
  };

  const handleModalSubmit = (formData) => {
    if (modalMode === "add") {
      const newFacility = {
        ...formData,
        no: facilities.length + 1,
      };
      setFacilities([...facilities, newFacility]);
    } else if (modalMode === "edit" && selectedFacility) {
      setFacilities(
        facilities.map((f) =>
          f.no === selectedFacility.no
            ? { ...formData, no: selectedFacility.no }
            : f
        )
      );
    }
  };

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
        handleEdit(order);
      },
    },
    {
      label: "Delete",
      icon: <Trash className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("Delete clicked", order);
      },
    },
  ];

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    loader(true);
    Api("GET", "/auth/USER?page=" + currentPage + "&limit=" + limit)
      .then((response) => {
        if (response.status) {
          setFacilities(response.data);
          setTotalRecords(response.total);
          setTotalPages(response.totalPages);
          setCurrentPage(response.page);
          console.log("Facilities fetched successfully:", response.data);
        } else {
          console.error("Failed to fetch facilities:", response.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching facilities:", error);
      })
      .finally(() => {
        loader(false);
      });
  }, [currentPage, limit]);

  const handlePageChange = (event) => {
    setCurrentPage(event.page + 1);
  };

  return (
    <Layout title="All Hospitals & Facilities">
      {/* Main Content */}
      <div className="bg-white shadow-sm overflow-hidden rounded-lg">
        {/* Add New Button */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            All Hospitals
          </span>

          <button
            onClick={handleAddNew}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Add New
          </button>
        </div>

        {/* Table with Horizontal Scroll for All Screen Sizes */}
        <DataTable
          value={facilities}
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
          rowClassName={() => "hover:bg-gray-50"}
          size="small"
          paginator
          rows={limit}
          totalRecords={totalRecords}
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
            field="name"
            header="Hospital Name"
            bodyStyle={{
              color: "#F97316",
              verticalAlign: "middle",
              fontSize: "14px",
            }}
          />
          <Column
            field="address"
            header="Address"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="primaryContact"
            header="Contact Person"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="phone"
            header="Phone"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="assignedRoute"
            header="Assigned Route"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => (
              <span>
                {rowData.assignedRoute || "N/A"}
              </span>
            )}
          />
          <Column
            field="deliveryWindow"
            header="Delivery Window"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => (
              <span>
                {rowData.deliveryWindow || "2AM - 6PM"}
              </span>
            )}
          />
          {/* <Column
            field="type"
            header="Type"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            // body={(rowData) => getStatusBadge(rowData.type)}
          /> */}
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

export default isAuth(HospitalsFacilities);
