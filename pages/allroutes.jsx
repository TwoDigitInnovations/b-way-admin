import React, { useEffect, useRef, useState } from "react";
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
  Map,
} from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import Layout from "@/components/layout";
import isAuth from "@/components/isAuth";
import RouteMapViewer from "@/components/RouteMapViewer";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Api } from "@/helper/service";
import toast from "react-hot-toast";
import {
  fetchRoutes,
  selectRoutes,
  selectLoading,
  selectTotal,
} from "@/store/routeSlice";
import { fetchDrivers } from "@/store/driverSlice";
import { MultiSelect } from "primereact/multiselect";
import { AutoComplete } from "primereact/autocomplete";
import { getStateAndCityPicklist } from "@/utils/states";

// Validation schema using Yup
const validationSchema = Yup.object({
  routeName: Yup.string()
    .required("Route name is required")
    .min(2, "Route name must be at least 2 characters"),
  startAddress: Yup.string().required("Start address is required"),
  startCity: Yup.string().required("Start city is required"),
  startState: Yup.string().required("Start state is required"),
  startZipcode: Yup.string()
    .required("Start zipcode is required")
    .matches(
      /^\d{5}(-\d{4})?$/,
      "Invalid zipcode format (e.g., 12345 or 12345-6789)"
    ),
  endAddress: Yup.string().required("End address is required"),
  endCity: Yup.string().required("End city is required"),
  endState: Yup.string().required("End state is required"),
  endZipcode: Yup.string()
    .required("End zipcode is required")
    .matches(
      /^\d{5}(-\d{4})?$/,
      "Invalid zipcode format (e.g., 12345 or 12345-6789)"
    ),
  stops: Yup.string().required("At least one stop is required"),
  assignedDriver: Yup.string().required("Assigned driver is required"),
  eta: Yup.string().required("ETA is required"),
  activeDays: Yup.array().min(1, "At least one active day is required"),
  status: Yup.string()
    .required("Status is required")
    .oneOf(["Active", "Completed", "Archive"], "Invalid status selected"),
});

// Initial form values
const initialValues = {
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
  activeDays: [],
  status: "",
};

function RoutesSchedules({ loader }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [selectedRouteData, setSelectedRouteData] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [mapModal, setMapModal] = useState(false);
  const menuRef = useRef(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const dispatch = useDispatch();
  const routes = useSelector(selectRoutes);
  const totalPages = useSelector(selectTotal);
  const loading = useSelector(selectLoading);
  const { drivers, assignedDriver } = useSelector((state) => state.driver);

  const [filteredStartCities, setFilteredStartCities] = useState(allCities);
  const [filteredStartStates, setFilteredStartStates] = useState(allStates);
  const [filteredEndCities, setFilteredEndCities] = useState(allCities);
  const [filteredEndStates, setFilteredEndStates] = useState(allStates);

  useEffect(() => {
    dispatch(fetchRoutes({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  useEffect(() => {
    dispatch(fetchDrivers());
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setEditingRoute(null);
    setSelectedRouteData(null);
  };

  const openAddModal = () => {
    setEditingRoute(null);
    setSelectedRouteData(null);
    setShowModal(true);
  };

  const fetchRouteDetails = (id) => {
    loader(true);
    Api("GET", `/route/map/${id}`)
      .then((res) => {
        if (res?.status) {
          setSelectedRouteData(res.route);
        }
      })
      .catch((err) => {
        toast.error(
          err?.message || "Failed to fetch route details. Please try again."
        );
      })
      .finally(() => {
        loader(false);
      });
  };

  const openEditModal = (route) => {
    setEditingRoute(route);
    setSelectedRouteData(route); // Use the route data directly first
    setShowModal(true); // Show modal immediately
    fetchRouteDetails(route._id); // Then fetch detailed data in background
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      loader(true);

      // Transform form data to match backend API structure
      const transformedData = {
        routeName: values.routeName,
        startLocation: {
          address: values.startAddress,
          city: values.startCity,
          state: values.startState,
          zipcode: values.startZipcode,
        },
        endLocation: {
          address: values.endAddress,
          city: values.endCity,
          state: values.endState,
          zipcode: values.endZipcode,
        },
        stops: values.stops
          .split(",")
          .map((stop) => ({ name: stop.trim(), address: stop.trim() }))
          .filter((stop) => stop.name),
        assignedDriver: values.assignedDriver,
        eta: values.eta,
        activeDays: Array.isArray(values.activeDays)
          ? values.activeDays
          : values.activeDays
              .split(",")
              .map((day) => day.trim())
              .filter((day) => day),
      };

      const method = editingRoute ? "PUT" : "POST";
      const url = editingRoute
        ? `/route/${editingRoute._id}`
        : "/route/create";

      const response = await Api(method, url, transformedData);

      if (response?.status || response?.success) {
        const message = editingRoute
          ? "Route updated successfully!"
          : "Route created successfully!";

        // Show additional details if route was created with AWS
        if (response?.routeDetails && !editingRoute) {
          toast.success(
            `${message} Distance: ${response.routeDetails.distance}, Duration: ${response.routeDetails.duration}`
          );
        } else {
          toast.success(message);
        }

        resetForm();
        closeModal();
        dispatch(fetchRoutes({ page: currentPage, limit }));
      } else {
        throw new Error(response?.message || "Failed to save route");
      }
    } catch (err) {
      console.error("Form submission error:", err);

      // Show more specific error messages
      if (err?.message?.includes("coordinates")) {
        toast.error(
          "Failed to find coordinates for the provided addresses. Please check the addresses and try again."
        );
      } else if (err?.message?.includes("AWS")) {
        toast.error(
          "Route created with basic data. AWS mapping service is not configured."
        );
      } else {
        toast.error(err?.message || "Failed to save route. Please try again.");
      }
    } finally {
      setSubmitting(false);
      loader(false);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    if (!routeId) return;

    // const confirmDelete = window.confirm(
    //   "Are you sure you want to delete this route? This action cannot be undone."
    // );

    // if (!confirmDelete) return;

    try {
      loader(true);
      const response = await Api("DELETE", `/route/${routeId}`);

      if (response?.status || response?.success) {
        toast.success("Route deleted successfully!");
        dispatch(fetchRoutes({ page: currentPage, limit }));
      } else {
        throw new Error(response?.message || "Failed to delete route");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err?.message || "Failed to delete route. Please try again.");
    } finally {
      loader(false);
    }
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  const handlePageChange = (event) => {
    setCurrentPage(event.page + 1);
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
      label: "View Details",
      icon: <Eye className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("View clicked", row);
        setViewModal(true);
        fetchRouteDetails(row._id);
      },
    },
    {
      label: "View Map",
      icon: <Map className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("Map clicked", row);
        setMapModal(true);
        setSelectedRowData(row);
        fetchRouteDetails(row._id);
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
        handleDeleteRoute(row._id);
      },
    },
  ];

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    loader(loading);
  }, [loading, loader]);

  // Autocomplete search for start city
  const searchStartCities = (event) => {
    const query = event.query.toLowerCase();
    const _filteredCities = allCities.filter((city) =>
      city.toLowerCase().includes(query)
    );
    setFilteredStartCities(_filteredCities);
  };
  // Autocomplete search for start state
  const searchStartStates = (event) => {
    const query = event.query.toLowerCase();
    const _filteredStates = allStates.filter((state) =>
      state.toLowerCase().includes(query)
    );
    setFilteredStartStates(_filteredStates);
  };
  // Autocomplete search for end city
  const searchEndCities = (event) => {
    const query = event.query.toLowerCase();
    const _filteredCities = allCities.filter((city) =>
      city.toLowerCase().includes(query)
    );
    setFilteredEndCities(_filteredCities);
  };
  // Autocomplete search for end state
  const searchEndStates = (event) => {
    const query = event.query.toLowerCase();
    const _filteredStates = allStates.filter((state) =>
      state.toLowerCase().includes(query)
    );
    setFilteredEndStates(_filteredStates);
  };

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

        <DataTable
          value={routes}
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
          rowClassName={() => "hover:bg-gray-50"}
          size="small"
          paginator
          rows={limit}
          totalRecords={totalPages}
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
            body={(rowData) => (
              <span>{rowData?.startLocation?.address || "N/A"}</span>
            )}
          />
          <Column
            field="endLocation"
            header="End Location"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => (
              <span>{rowData?.endLocation?.address || "N/A"}</span>
            )}
          />
          <Column
            field="stops"
            header="Stops"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => {
              const stopsArr = Array.isArray(rowData.stops)
                ? rowData.stops.map((stop) => stop.name)
                : [];
              const maxVisible = 3;
              if (stopsArr.length === 0) return <span>N/A</span>;
              const visibleStops = stopsArr.slice(0, maxVisible).join(", ");
              const moreCount = stopsArr.length - maxVisible;
              return (
                <span>
                  {visibleStops || "No Stops"}
                  {moreCount > 0 && (
                    <span className="text-gray-500 ml-1">
                      +{moreCount} more
                    </span>
                  )}
                </span>
              );
            }}
          />
          <Column
            field="assignedDriver"
            header="Assigned Driver"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => (
              <span>
                {rowData.assignedDriver
                  ? rowData.assignedDriver?.driver?.name || "N/A"
                  : "N/A"}
              </span>
            )}
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
            body={(rowData) => (
              <span>
                {rowData.activeDays ? rowData.activeDays.join(", ") : "N/A"}
              </span>
            )}
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
              <div className="relative flex justify-center space-x-1">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setMapModal(true);
                    setSelectedRowData(rowData);
                    fetchRouteDetails(rowData._id);
                  }}
                  className="p-1 rounded hover:bg-blue-100 focus:outline-none"
                  title="View Route Map"
                >
                  <Map className="w-4 h-4 text-gray-500" />
                </button>
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#003C72]">
                {editingRoute
                  ? "Edit Routes & Schedules"
                  : "Add Routes & Schedules"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <Formik
              initialValues={
                editingRoute
                  ? {
                      routeName:
                        selectedRouteData?.routeName ||
                        editingRoute?.routeName ||
                        "",
                      startAddress:
                        selectedRouteData?.startLocation?.address ||
                        editingRoute?.startLocation?.address ||
                        "",
                      startCity:
                        selectedRouteData?.startLocation?.city ||
                        editingRoute?.startLocation?.city ||
                        "",
                      startState:
                        selectedRouteData?.startLocation?.state ||
                        editingRoute?.startLocation?.state ||
                        "",
                      startZipcode:
                        selectedRouteData?.startLocation?.zipcode ||
                        editingRoute?.startLocation?.zipcode ||
                        "",
                      endAddress:
                        selectedRouteData?.endLocation?.address ||
                        editingRoute?.endLocation?.address ||
                        "",
                      endCity:
                        selectedRouteData?.endLocation?.city ||
                        editingRoute?.endLocation?.city ||
                        "",
                      endState:
                        selectedRouteData?.endLocation?.state ||
                        editingRoute?.endLocation?.state ||
                        "",
                      endZipcode:
                        selectedRouteData?.endLocation?.zipcode ||
                        editingRoute?.endLocation?.zipcode ||
                        "",
                      stops: selectedRouteData?.stops
                        ? selectedRouteData.stops.join(", ")
                        : editingRoute?.stops
                        ? editingRoute.stops.join(", ")
                        : "",
                      assignedDriver:
                        selectedRouteData?.assignedDriver?._id ||
                        editingRoute?.assignedDriver?._id ||
                        selectedRouteData?.assignedDriver ||
                        editingRoute?.assignedDriver ||
                        "",
                      eta: selectedRouteData?.eta || editingRoute?.eta || "",
                      activeDays:
                        selectedRouteData?.activeDays ||
                        editingRoute?.activeDays ||
                        [],
                      status:
                        selectedRouteData?.status || editingRoute?.status || "",
                    }
                  : initialValues
              }
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
              enableReinitialize={true}
            >
              {({ isSubmitting, touched, errors, setFieldValue, values }) => (
                <Form className="p-6 space-y-6">
                  {/* Route Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Route Name *
                    </label>
                    <Field
                      type="text"
                      name="routeName"
                      placeholder="Enter route name"
                      className={`w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        touched.routeName && errors.routeName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <ErrorMessage
                      name="routeName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Start Location */}
                  <div>
                    <label className="block text-sm font-bold text-[#003C72] mb-2">
                      Start Location
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <Field
                          type="text"
                          name="startAddress"
                          placeholder="Address *"
                          className={`w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                            touched.startAddress && errors.startAddress
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          name="startAddress"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <AutoComplete
                          value={values.startCity}
                          suggestions={filteredStartCities}
                          completeMethod={searchStartCities}
                          onChange={(e) => setFieldValue("startCity", e.value)}
                          dropdown
                          placeholder="Select or type city"
                          inputClassName="w-full max-w-[220px] px-3 py-2 min-h-[40px] border border-gray-300 rounded-md focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700"
                          className="w-full max-w-[220px]"
                          panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                          itemTemplate={(item) => (
                            <div className="px-3 py-2 hover:bg-gray-100 text-sm">
                              {item}
                            </div>
                          )}
                        />
                        <ErrorMessage
                          name="startCity"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <AutoComplete
                          value={values.startState}
                          suggestions={filteredStartStates}
                          completeMethod={searchStartStates}
                          onChange={(e) => setFieldValue("startState", e.value)}
                          dropdown
                          placeholder="Select or type state"
                          inputClassName="w-full max-w-[220px] px-3 py-2 min-h-[40px] border border-gray-300 rounded-md focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700"
                          className="w-full max-w-[220px]"
                          panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                          itemTemplate={(item) => (
                            <div className="px-3 py-2 hover:bg-gray-100 text-sm">
                              {item}
                            </div>
                          )}
                        />
                        <ErrorMessage
                          name="startState"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zipcode *
                        </label>
                        <Field
                          type="text"
                          name="startZipcode"
                          placeholder="Zipcode *"
                          maxLength={5}
                          className={`w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                            touched.startZipcode && errors.startZipcode
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          name="startZipcode"
                          component="div"
                          className="text-red-500 text-xs mt-1"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <Field
                          type="text"
                          name="endAddress"
                          placeholder="Address *"
                          className={`w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                            touched.endAddress && errors.endAddress
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          name="endAddress"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <AutoComplete
                          value={values.endCity}
                          suggestions={filteredEndCities}
                          completeMethod={searchEndCities}
                          onChange={(e) => setFieldValue("endCity", e.value)}
                          dropdown
                          placeholder="Select or type city"
                          inputClassName="w-full max-w-[220px] px-3 py-2 min-h-[40px] border border-gray-300 rounded-md focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700"
                          className="w-full max-w-[220px]"
                          panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                          itemTemplate={(item) => (
                            <div className="px-3 py-2 hover:bg-gray-100 text-sm">
                              {item}
                            </div>
                          )}
                        />
                        <ErrorMessage
                          name="endCity"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <AutoComplete
                          value={values.endState}
                          suggestions={filteredEndStates}
                          completeMethod={searchEndStates}
                          onChange={(e) => setFieldValue("endState", e.value)}
                          dropdown
                          placeholder="Select or type state"
                          inputClassName="w-full max-w-[220px] px-3 py-2 min-h-[40px] border border-gray-300 rounded-md focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700"
                          className="w-full max-w-[220px]"
                          panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                          itemTemplate={(item) => (
                            <div className="px-3 py-2 hover:bg-gray-100 text-sm">
                              {item}
                            </div>
                          )}
                        />
                        <ErrorMessage
                          name="endState"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zipcode *
                        </label>
                        <Field
                          type="text"
                          name="endZipcode"
                          placeholder="Zipcode *"
                          maxLength={5}
                          className={`w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                            touched.endZipcode && errors.endZipcode
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <ErrorMessage
                          name="endZipcode"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Stops */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stops *
                      </label>
                      <Field
                        as="select"
                        name="stops"
                        className={`w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                          touched.stops && errors.stops
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Stops</option>
                        <option
                          value="Jammu Hospital"
                          selected={values.stops === "Jammu Hospital"}
                        >
                          Jammu Hospital
                        </option>
                        <option
                          value="Capitol Hospital"
                          selected={values.stops === "Capitol Hospital"}
                        >
                          Capitol Hospital
                        </option>
                        <option
                          value="Bellevue Hospital"
                          selected={values.stops === "Bellevue Hospital"}
                        >
                          Bellevue Hospital
                        </option>
                        <option
                          value="Oxford Hospital"
                          selected={values.stops === "Oxford Hospital"}
                        >
                          Oxford Hospital
                        </option> 
                        <option
                          value="CVS Pharmacy"
                          selected={values.stops === "CVS Pharmacy"}
                        >
                          CVS Pharmacy
                        </option>
                        <option
                          value="Jim Pharmacy"
                          selected={values.stops === "Jim Pharmacy"}
                        >
                          Jim Pharmacy
                        </option>
                      </Field>
                      <ErrorMessage
                        name="stops"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Assigned Driver */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assigned Driver *
                      </label>
                      <Field
                        as="select"
                        name="assignedDriver"
                        className={`w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                          touched.assignedDriver && errors.assignedDriver
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Assigned Driver</option>
                        {drivers.map((driver) => (
                          <option
                            key={driver._id}
                            value={driver._id}
                            selected={driver._id === values.assignedDriver}
                          >
                            {driver.driver.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="assignedDriver"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* ETA */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ETA *
                      </label>
                      <div className="relative">
                        <Field
                          type="text"
                          name="eta"
                          placeholder="2:10 PM"
                          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                            touched.eta && errors.eta
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <ErrorMessage
                        name="eta"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Active Days */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Active Days *
                      </label>
                      <MultiSelect
                        value={values.activeDays}
                        onChange={(e) => setFieldValue("activeDays", e.value)}
                        options={days}
                        optionLabel="name"
                        placeholder="Select Active Days"
                        maxSelectedLabels={3}
                      />
                      <ErrorMessage
                        name="activeDays"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <Field
                        as="select"
                        name="status"
                        className={`w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                          touched.status && errors.status
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Archive">Archive</option>
                      </Field>
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6 gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-secondary text-white px-6 py-2 rounded-md font-medium hover:secondary focus:outline-none focus:ring-2 focus:secondary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : editingRoute
                        ? "Update Route"
                        : "Create Route"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {viewModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Route Details
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
                  <div className="col-span-3 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Route Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.routeName || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Assigned Driver
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.assignedDriver?.name ||
                        selectedRowData?.assignedDriver?.driver?.name ||
                        "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">Stops</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {Array.isArray(selectedRowData?.stops)
                        ? selectedRowData.stops.join(", ")
                        : selectedRowData?.stops || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-2 py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Active Days
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                      {Array.isArray(selectedRowData?.activeDays)
                        ? selectedRowData.activeDays.join(", ")
                        : selectedRowData?.activeDays || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">ETA</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.eta || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.status || "N/A"}
                    </dd>
                  </div>
                  <h2 className="col-span-6 text-md font-semibold text-[#003C72] py-2">
                    Start Location
                  </h2>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.startLocation?.address || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">City</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.startLocation?.city || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">State</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.startLocation?.state || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Zipcode
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.startLocation?.zipcode || "N/A"}
                    </dd>
                  </div>
                  <h2 className="col-span-6 text-md font-semibold text-[#003C72] py-3">
                    End Location
                  </h2>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.endLocation?.address || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">City</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.endLocation?.city || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">State</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.endLocation?.state || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Zipcode
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedRowData?.endLocation?.zipcode || "N/A"}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Additional details can be added here */}
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {mapModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Map className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Route Map -{" "}
                  {selectedRouteData?.routeName || selectedRowData?.routeName}
                </h2>
              </div>
              <button
                onClick={() => {
                  setMapModal(false);
                  setSelectedRowData(null);
                  setSelectedRouteData(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              {selectedRouteData ? (
                <RouteMapViewer
                  routeData={selectedRouteData}
                  height="500px"
                  showControls={true}
                />
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Loading route data...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="px-4 pb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-700 mb-2">
                  Route Information
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Driver:</span>
                    <p className="font-medium">
                      {selectedRouteData?.assignedDriver?.driver?.name ||
                        selectedRowData?.assignedDriver?.driver?.name ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-medium">
                      {selectedRouteData?.status || selectedRowData?.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">ETA:</span>
                    <p className="font-medium">
                      {selectedRouteData?.eta || selectedRowData?.eta}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Active Days:</span>
                    <p className="font-medium">
                      {(
                        selectedRouteData?.activeDays ||
                        selectedRowData?.activeDays ||
                        []
                      ).join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default isAuth(RoutesSchedules);

const days = [
  { name: "Monday", value: "Mon" },
  { name: "Tuesday", value: "Tue" },
  { name: "Wednesday", value: "Wed" },
  { name: "Thursday", value: "Thu" },
  { name: "Friday", value: "Fri" },
  { name: "Saturday", value: "Sat" },
  { name: "Sunday", value: "Sun" },
];

const statesAndCities = getStateAndCityPicklist();
const allCities = Object.values(statesAndCities).flat();
const allStates = Object.keys(statesAndCities);
