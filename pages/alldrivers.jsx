import React, { useRef, useState, useEffect } from "react";
import { MoreHorizontal, Eye, Edit3, X, Trash } from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Menu } from "primereact/menu";
import Layout from "@/components/layout";
import isAuth from "@/components/isAuth";
import { Api } from "@/helper/service";

function AddEditModal({ isOpen, onClose, mode, facility, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNo: "",
    vehicleType: "",
    assignedRoute: [],
    status: "",
  });
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    if (mode === "edit" && facility) {
      setFormData({
        name: facility.driver?.name || "",
        email: facility.driver?.email || "",
        phone: facility.driver?.phone || "",
        licenseNo: facility.licenseNumber || "",
        vehicleType: facility.vehicleType || "",
        assignedRoute: facility.assignedRoute?.map((route) => route._id) || [],
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
        assignedRoute: [],
        status: "",
      });
    }
  }, [mode, facility, isOpen]);

  // Fetch routes for dropdown
  useEffect(() => {
    if (isOpen) {
      Api("GET", "/route?page=0&limit=0")
        .then((response) => {
          if (response.status) {
            setRoutes(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching routes:", error);
        });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRouteChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      assignedRoute: checked
        ? [...prev.assignedRoute, value]
        : prev.assignedRoute.filter((route) => route !== value),
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
                name="email"
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
                name="licenseNo"
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

            {/* <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Assigned Routes
              </label>
              <select
                name="assignedRoute"
                value={formData.assignedRoute}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
                required
              >
                <option value="">Select Assigned Route</option>
                {routes.map((route) => (
                  <option key={route._id} value={route._id}>
                    {route.routeName}
                  </option>
                ))}
              </select>
            </div> */}

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

function DriversVehicles({ loader }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [driversData, setDriversData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  const handleModalSubmit = async (formData) => {
    try {
      loader(true);

      if (modalMode === "add") {
        const response = await Api("POST", "/driver", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          licenseNumber: formData.licenseNo,
          vehicleType: formData.vehicleType,
          assignedRoute:
            formData.assignedRoute.length > 0 ? formData.assignedRoute : [],
          status: formData.status,
        });

        if (response.status) {
          console.log("Driver created successfully");
          // Refresh the driver list
          const driversResponse = await Api(
            "GET",
            "/driver?page=" + currentPage + "&limit=" + limit
          );
          if (driversResponse.status) {
            setDriversData(driversResponse.data);
            setTotalPages(driversResponse.totalPages);
            setTotalRecords(driversResponse.total);
          }
        }
      } else if (modalMode === "edit" && selectedFacility) {
        const response = await Api("PUT", "/driver/" + selectedFacility._id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          licenseNumber: formData.licenseNo,
          vehicleType: formData.vehicleType,
          assignedRoute:
            formData.assignedRoute.length > 0 ? formData.assignedRoute : [],
          status: formData.status,
        });

        if (response.status) {
          console.log("Driver updated successfully");
          // Refresh the driver list
          const driversResponse = await Api(
            "GET",
            "/driver?page=" + currentPage + "&limit=" + limit
          );
          if (driversResponse.status) {
            setDriversData(driversResponse.data);
            setTotalPages(driversResponse.totalPages);
            setTotalRecords(driversResponse.total);
          }
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      loader(false);
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

  const handleDelete = async (driver) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        loader(true);
        const response = await Api("DELETE", "/driver/" + driver._id);

        if (response.status) {
          console.log("Driver deleted successfully");
          // Refresh the driver list
          const driversResponse = await Api(
            "GET",
            "/driver?page=" + currentPage + "&limit=" + limit
          );
          if (driversResponse.status) {
            setDriversData(driversResponse.data);
            setTotalPages(driversResponse.totalPages);
            setTotalRecords(driversResponse.total);
          }
        }
      } catch (error) {
        console.error("Error deleting driver:", error);
      } finally {
        loader(false);
      }
    }
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
        handleDelete(row);
      },
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
      Inactive: "bg-gray-100 text-gray-800 border border-gray-200",
      Pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      Suspended: "bg-orange-100 text-orange-800 border border-orange-200",
      Retired: "bg-purple-100 text-purple-800 border border-purple-200",
      "On-Hold": "bg-pink-100 text-pink-800 border border-pink-200",
      "Under Review": "bg-teal-100 text-teal-800 border border-teal-200",
      Terminated: "bg-gray-300 text-gray-800 border border-gray-300",
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

  useEffect(() => {
    loader(true);
    Api("GET", "/driver?page=" + currentPage + "&limit=" + limit)
      .then((response) => {
        if (response.status) {
          setDriversData(response.data);
          setTotalPages(response.totalPages);
          setTotalRecords(response.total);
          setCurrentPage(response.page);
          console.log("Drivers fetched successfully:", response.data);
        } else {
          console.error("Failed to fetch drivers:", response.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
      })
      .finally(() => {
        loader(false);
      });
  }, [currentPage, limit]);

  const handlePageChange = (event) => {
    setCurrentPage(event.page + 1);
  };

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
            body={(rowData) => (
              <span className="text-gray-800 font-medium">
                {rowData.driver.name}
              </span>
            )}
          />
          <Column
            field="email"
            header="Email"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => <span>{rowData.driver.email}</span>}
          />
          <Column
            field="phone"
            header="Phone"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => <span>{rowData.driver.phone}</span>}
          />
          <Column
            field="licenseNumber"
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
            header="Assigned Routes"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => (
              // <div>
              //   {rowData.assignedRoute && rowData.assignedRoute.length > 0 ? (
              //     <div className="flex flex-wrap gap-1">
              //       {rowData.assignedRoute.map((route, index) => (
              //         <span
              //           key={route._id || index}
              //           className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              //         >
              //           {route.routeName}
              //         </span>
              //       ))}
              //     </div>
              //   ) : (
              //     <span className="text-gray-500">No routes assigned</span>
              //   )}
              // </div>
              <div>
                {rowData.assignedRoute && rowData.assignedRoute.length > 0 ? (
                  <span>
                    {rowData.assignedRoute
                      .map((route) => route.routeName)
                      .join(", ")}
                  </span>
                ) : (
                  <span className="text-gray-500">No routes assigned</span>
                )}
              </div>
            )}
          />
          <Column
            field="status"
            header="Status"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
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
