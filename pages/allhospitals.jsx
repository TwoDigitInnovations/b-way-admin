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
import Dialog from "@/components/Dialog";
import toast from "react-hot-toast";
import { AutoComplete } from "primereact/autocomplete";
import { getStateAndCityPicklist } from "@/utils/states";

// Add/Edit Modal Component
function AddEditModal({ isOpen, onClose, mode, facility, onSubmit }) {
  const statesAndCities = getStateAndCityPicklist();
  const allCities = Object.values(statesAndCities).flat();
  const allStates = Object.keys(statesAndCities);
  const [filteredCities, setFilteredCities] = useState(allCities);
  const [filteredStates, setFilteredStates] = useState(allStates);

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

  // Autocomplete search for city
  const searchCities = (event) => {
    let filtered = [];
    if (!event.query || event.query.length === 0) {
      filtered = allCities;
    } else {
      filtered = allCities.filter((city) =>
        city.toLowerCase().includes(event.query.toLowerCase())
      );
    }
    setFilteredCities(filtered);
  };
  // Autocomplete search for state
  const searchStates = (event) => {
    let filtered = [];
    if (!event.query || event.query.length === 0) {
      filtered = allStates;
    } else {
      filtered = allStates.filter((state) =>
        state.toLowerCase().includes(event.query.toLowerCase())
      );
    }
    setFilteredStates(filtered);
  };

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
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring focus:ring-primary focus:border-primary text-gray-700"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring focus:ring-primary focus:border-primary text-gray-700"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring focus:ring-primary focus:border-primary text-gray-700"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring focus:ring-primary focus:border-primary text-gray-700"
                required
              />
            </div>

            {/* Row 3 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <AutoComplete
                value={formData.city}
                suggestions={filteredCities}
                completeMethod={searchCities}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.value }))
                }
                dropdown
                placeholder="Select or type city"
                inputClassName="w-full px-3 py-2 min-h-[40px] border border-gray-300 rounded-md focus:outline-none focus:!ring-2 focus:!ring-primary focus:!border-primary !text-sm text-gray-700"
                className="w-full"
                panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                itemTemplate={(item) => (
                  <div className="px-3 py-2 hover:bg-gray-100 text-sm">
                    {item}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <AutoComplete
                value={formData.state}
                suggestions={filteredStates}
                completeMethod={searchStates}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, state: e.value }))
                }
                dropdown
                placeholder="Select or type state"
                inputClassName="w-full px-3 py-2 min-h-[40px] border border-gray-300 rounded-md focus:outline-none focus:!ring-2 focus:!ring-primary focus:!border-primary !text-sm text-gray-700"
                className="w-full"
                panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                itemTemplate={(item) => (
                  <div className="px-3 py-2 hover:bg-gray-100 text-sm">
                    {item}
                  </div>
                )}
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring focus:ring-primary focus:border-primary text-gray-700"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring focus:ring-primary focus:border-primary bg-white text-gray-700"
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
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-primary focus:border-primary text-gray-700"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring focus:ring-primary focus:border-primary bg-white text-gray-700"
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
              className="bg-secondary hover:bg-secondary text-white px-8 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2"
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
  const [viewModal, setViewModal] = useState(false);

  const [facilities, setFacilities] = useState([]);

  // Dialog state
  const [dialogConfig, setDialogConfig] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: () => {},
  });

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

  const handleDelete = async (hospital) => {
    try {
      loader(true);
      const response = await Api("DELETE", "/hospital/" + hospital._id);

      if (response.status) {
        toast.success("Hospital deleted successfully");
        // Refresh the hospital list
        const hospitalsResponse = await Api(
          "GET",
          "/hospital?page=" + currentPage + "&limit=" + limit
        );
        if (hospitalsResponse.status) {
          setFacilities(hospitalsResponse.data);
          setTotalPages(hospitalsResponse.totalPages);
          setTotalRecords(hospitalsResponse.total);
        }
      }
    } catch (error) {
      console.error("Error deleting hospital:", error);
      toast.error("Failed to delete hospital. Please try again.");
    } finally {
      loader(false);
      closeDialog();
    }
  };

  // Dialog helper functions
  const showDeleteDialog = (hospital) => {
    setDialogConfig({
      open: true,
      type: "danger",
      title: "Delete Hospital",
      message: `Are you sure you want to delete hospital "${hospital.hospitalName || hospital.name}"? This action cannot be undone and will affect all related orders and routes.`,
      confirmText: "Delete Hospital",
      cancelText: "Cancel",
      onConfirm: () => handleDelete(hospital),
      customIcon: Trash,
    });
  };

  const closeDialog = () => {
    setDialogConfig(prev => ({ ...prev, open: false }));
  };

  const getMenuItems = (order) => [
    {
      label: "View",
      icon: <Eye className="w-5 h-5 text-gray-500" />,
      command: () => {
        fetchHospitalDetailsForView(order._id);
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
        showDeleteDialog(order);
      },
    },
  ];

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    loader(true);
    Api("GET", "/auth/HOSPITAL?page=" + currentPage + "&limit=" + limit)
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

  const fetchHospitalDetailsForView = (id) => {
    loader(true);
    Api("GET", `/auth/user/${id}`)
      .then((response) => {
        console.log("Hospital view details fetched:", response);
        setSelectedRowData(response.data || response);
        setViewModal(true);
      })
      .catch((error) => {
        toast.error(
          error?.message || "Failed to fetch hospital details. Please try again."
        );
      })
      .finally(() => {
        loader(false);
      });
  };

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

          {/* <button
            onClick={handleAddNew}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Add New
          </button> */}
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
            body={(rowData) => (
              <span>
                {rowData.billing_Address.address}, {rowData.billing_Address.city}, {rowData.billing_Address.state}{" "}
                {rowData.billing_Address.zipcode}
              </span>
            )}
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
            body={(rowData) => <span>{rowData.assignedRoute || "N/A"}</span>}
          />
          <Column
            field="deliveryWindow"
            header="Delivery Window"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => (
              <span>{rowData.deliveryWindow || "2AM - 6PM"}</span>
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

      {/* View Details Modal */}
      {viewModal && selectedRowData && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Hospital Details
              </h2>
              <button
                onClick={() => {
                  setViewModal(false);
                  setSelectedRowData(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="bg-white">
                <dl className="w-full grid grid-cols-6 gap-4">
                  {/* Basic Information */}
                  <h2 className="col-span-6 text-md font-semibold text-[#003C72] py-2">
                    Basic Information
                  </h2>
                  <div className="col-span-3 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Hospital Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.name || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Contact Person
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.primaryContact || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Phone
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.phone || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Email
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.email || "N/A"}
                    </dd>
                  </div>

                  {/* Address Information */}
                  <h2 className="col-span-6 text-md font-semibold text-[#003C72] py-3">
                    Billing Information
                  </h2>
                  <div className="col-span-6 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Full Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.billing_Address ? 
                        `${selectedRowData?.user?.billing_Address.address} `
                        : "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      City
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.billing_Address?.city || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      State
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.billing_Address?.state || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Zipcode
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.billing_Address?.zipcode || "N/A"}
                    </dd>
                  </div>

<h2 className="col-span-6 text-md font-semibold text-[#003C72] py-3">
                    Shipping Information
                  </h2>
                  <div className="col-span-6 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Full Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.delivery_Address ? 
                        `${selectedRowData?.user?.delivery_Address.address} `
                        : "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      City
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.delivery_Address?.city || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      State
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.delivery_Address?.state || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Zipcode
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.delivery_Address?.zipcode || "N/A"}
                    </dd>
                  </div>
                  {/* Service Information */}
                  {/* <h2 className="col-span-6 text-md font-semibold text-[#003C72] py-3">
                    Service Information
                  </h2> */}
                  {/* <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Assigned Route
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.assignedRoute || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Delivery Window
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.deliveryWindow || "2AM - 6PM"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Facility Type
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.role || selectedRowData?.type || "Hospital"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.status || "Active"}
                    </dd>
                  </div> */}
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <AddEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        facility={selectedFacility}
        onSubmit={handleModalSubmit}
      />

      {/* Dynamic Dialog Component */}
      <Dialog
        open={dialogConfig.open}
        type={dialogConfig.type}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmText={dialogConfig.confirmText}
        cancelText={dialogConfig.cancelText}
        onConfirm={dialogConfig.onConfirm}
        onCancel={closeDialog}
        onClose={closeDialog}
        customIcon={dialogConfig.customIcon}
      />
    </Layout>
  );
}

export default isAuth(HospitalsFacilities);
