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
} from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import Layout from "@/components/layout";
import { Api } from "@/helper/service";
import Dialog from "@/components/Dialog";
import toast from "react-hot-toast";

function AddEditModal({ isOpen, onClose, mode, facility, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    if (mode === "edit" && facility) {
      setFormData({
        name: facility.name || "",
        email: facility.email || "",
        phone: facility.phone || "",
        role: facility.role || "",
        assignedRoute: facility.assignedRoute || "",
        status: facility.status || "",
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
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
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#003C72]">
            {mode === "add" ? "Add Dispatcher" : "Edit Dispatcher"}
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
                required
              >
                <option value="">Select Role</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Driver">Driver</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
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
                <option value="Inactive">Inactive</option>
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

function AllDispatchers({loader}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [dispatchersData, setDispatchersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

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

  const handleDelete = async (dispatcher) => {
    try {
      loader(true);
      const response = await Api("DELETE", "/auth/" + dispatcher._id);

      if (response.status) {
        toast.success("Dispatcher deleted successfully");
        // Refresh the dispatcher list
        const dispatchersResponse = await Api(
          "GET",
          "/auth/DISPATCHER?page=" + currentPage + "&limit=" + limit
        );
        if (dispatchersResponse.status) {
          setDispatchersData(dispatchersResponse.data);
          setTotalPages(dispatchersResponse.totalPages);
          setTotalRecords(dispatchersResponse.total);
        }
      }
    } catch (error) {
      console.error("Error deleting dispatcher:", error);
      toast.error("Failed to delete dispatcher. Please try again.");
    } finally {
      loader(false);
      closeDialog();
    }
  };

  // Dialog helper functions
  const showDeleteDialog = (dispatcher) => {
    setDialogConfig({
      open: true,
      type: "danger",
      title: "Delete Dispatcher",
      message: `Are you sure you want to delete dispatcher "${dispatcher.name}"? This action cannot be undone.`,
      confirmText: "Delete Dispatcher",
      cancelText: "Cancel",
      onConfirm: () => handleDelete(dispatcher),
      customIcon: Trash,
    });
  };

  const closeDialog = () => {
    setDialogConfig(prev => ({ ...prev, open: false }));
  };

  const getMenuItems = (row) => [
    {
      label: "View",
      icon: <Eye className="w-5 h-5 text-gray-500" />,
      command: () => {
        fetchDispatcherDetailsForView(row._id);
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
        showDeleteDialog(row);
      },
    },
  ];

  const getStatusStyle = (status) => {
    const statusStyles = {
      Active: "bg-green-100 text-green-800 border border-green-200",
      Inactive: "bg-red-100 text-red-800 border border-red-200",
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

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    loader(true);
    Api("GET", "/auth/DISPATCHER?page=" + currentPage + "&limit=" + limit)
      .then((response) => {
        if (response.status) {
          setDispatchersData(response.data);
          setTotalPages(response.totalPages);
          setTotalRecords(response.total);
          setCurrentPage(response.page);
          console.log("Dispatchers fetched successfully:", response.data);
        } else {
          console.error("Failed to fetch dispatchers:", response.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching dispatchers:", error);
      })
      .finally(() => {
        loader(false);
      });
  }, [currentPage, limit]);

  const fetchDispatcherDetailsForView = (id) => {
    loader(true);
    Api("GET", `/auth/user/${id}`)
      .then((response) => {
        console.log("Dispatcher view details fetched:", response);
        setSelectedRowData(response.data || response);
        setViewModal(true);
      })
      .catch((error) => {
        toast.error(
          error?.message || "Failed to fetch dispatcher details. Please try again."
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
    <Layout title="All Dispatchers">
      {/* Main Content */}
      <div className="bg-white shadow-sm overflow-hidden rounded-lg">
        {/* Add New Button */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            All Dispatchers
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
          value={dispatchersData}
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
            field="role"
            header="Role"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="status"
            header="Status"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => getStatusStyle(rowData.status || "Active")}
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

      {/* View Details Modal */}
      {viewModal && selectedRowData && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Dispatcher Details
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
                  {/* Personal Information */}
                  <h2 className="col-span-6 text-md font-semibold text-[#003C72] py-2">
                    Personal Information
                  </h2>
                  <div className="col-span-3 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Full Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.name || "N/A"}
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
                  <div className="col-span-3 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Phone
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.phone || "N/A"}
                    </dd>
                  </div>

                  {/* Role Information */}
                  <h2 className="col-span-6 text-md font-semibold text-[#003C72] py-3">
                    Role & Status
                  </h2>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Role
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.role || "Dispatcher"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(selectedRowData?.status)}`}>
                        {selectedRowData?.status || "Active"}
                      </span>
                    </dd>
                  </div>
                  {/* <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Assigned Routes
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.assignedRoute || "N/A"}
                    </dd>
                  </div> */}
                  {/* <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Department
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.department || "Logistics"}
                    </dd>
                  </div> */}

                  {/* Account Information */}
                  <h2 className="col-span-6 text-md font-semibold text-[#003C72] py-3">
                    Account Information
                  </h2>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Join Date
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.user?.createdAt ? new Date(selectedRowData.user.createdAt).toLocaleDateString() : "N/A"}
                    </dd>
                  </div>
                  {/* <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Last Login
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.lastLogin ? new Date(selectedRowData.lastLogin).toLocaleDateString() : "N/A"}
                    </dd>
                  </div> */}
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default AllDispatchers;
