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
  User,
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
import { getStateAndCityPicklist } from "@/utils/states";
import {
  Autocomplete,
  MenuItem,
  Select,
  TextField,
  Chip,
  Box,
  Checkbox,
} from "@mui/material";
import { fetchHospital } from "@/store/hospitalSlice";
import Dialog from "@/components/Dialog";

// Get states and cities data
const statesAndCities = getStateAndCityPicklist();
const allCities = Object.values(statesAndCities).flat();
const allStates = Object.keys(statesAndCities);

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
  stops: Yup.array().min(1, "At least one stop is required"),
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
  stops: [],
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
  const [assignModal, setAssignModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const dispatch = useDispatch();
  const routes = useSelector(selectRoutes);
  const totalPages = useSelector(selectTotal);
  const loading = useSelector(selectLoading);
  const { drivers, assignedDriver } = useSelector((state) => state.driver);
  const { hospitals } = useSelector((state) => state.hospital);

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

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
    dispatch(fetchRoutes({ page: currentPage, limit }));
    dispatch(fetchHospital());
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
        stops: Array.isArray(values.stops)
          ? values.stops.map((stop) => ({ name: stop, address: stop }))
          : [],
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
      const url = editingRoute ? `/route/${editingRoute._id}` : "/route/create";

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
      closeDialog();
    }
  };

  // Dialog helper functions
  const showDeleteDialog = (route) => {
    setDialogConfig({
      open: true,
      type: "danger",
      title: "Delete Route",
      message: `Are you sure you want to delete the route "${route.routeName}"? This action cannot be undone and will affect all assigned orders.`,
      confirmText: "Delete Route",
      cancelText: "Cancel",
      onConfirm: () => handleDeleteRoute(route._id),
      customIcon: Trash,
    });
  };

  const openAssignTempDriverModal = (route) => {
    setAssignModal(true);
    setSelectedRoute(route);
    console.log("Assign Temp Driver clicked", route);
  };

  const closeDialog = () => {
    setDialogConfig((prev) => ({ ...prev, open: false }));
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
      label: "Assign Temp Driver",
      icon: <UserPlus className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("Assign Temp Driver clicked", row);
        openAssignTempDriverModal(row);
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

  const assignTempDriver = async () => {
    if (!selectedRoute || !selectedDriver) return;

    const data = {
      driverId: selectedDriver,
      routeId: selectedRoute._id
    }

    try {
      const response = await Api("POST", `/route/assign-temp-driver`, data);
      if (response?.status) {
        toast.success("Temporary driver assigned successfully!");
        setAssignModal(false);
        setSelectedRoute(null);
        setSelectedDriver(null);
        fetchRoutes();
      } else {
        toast.error("Failed to assign temporary driver. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning temporary driver:", error);
      toast.error("An error occurred while assigning the temporary driver.");
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    loader(loading);
  }, [loading, loader]);

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
                {rowData.assignedDriver?.driver?.name
                  || rowData.temporaryDriver?.driver?.driver?.name
                  || "N/A"}
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
                        ? Array.isArray(selectedRouteData.stops)
                          ? selectedRouteData.stops.map((stop) =>
                              typeof stop === "string" ? stop : stop.name
                            )
                          : []
                        : editingRoute?.stops
                        ? Array.isArray(editingRoute.stops)
                          ? editingRoute.stops.map((stop) =>
                              typeof stop === "string" ? stop : stop.name
                            )
                          : []
                        : [],
                      assignedDriver:
                        selectedRouteData?.assignedDriver?._id ||
                        editingRoute?.assignedDriver?._id ||
                        selectedRouteData?.assignedDriver ||
                        editingRoute?.assignedDriver ||
                        "",
                      eta: selectedRouteData?.eta || editingRoute?.eta || "",
                      activeDays: selectedRouteData?.activeDays
                        ? Array.isArray(selectedRouteData.activeDays)
                          ? selectedRouteData.activeDays.map((stop) =>
                              typeof stop === "string" ? stop : stop.name
                            )
                          : []
                        : editingRoute?.activeDays
                        ? Array.isArray(editingRoute.activeDays)
                          ? editingRoute.activeDays.map((stop) =>
                              typeof stop === "string" ? stop : stop.name
                            )
                          : []
                        : [],
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
                      name="routeName"
                      render={({ field, meta }) => (
                        <>
                          <TextField
                            {...field}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                height: "40px",
                                fontSize: "14px",
                                "& fieldset": {
                                  borderColor: "#d1d5db",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#9ca3af",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#3b82f6",
                                  borderWidth: "2px",
                                },
                              },
                              "& .MuiInputBase-input": {
                                color: "#374151",
                                fontSize: "14px",
                              },
                            }}
                            fullWidth
                            placeholder="Enter route name"
                            error={meta.touched && !!meta.error}
                            helperText={meta.touched && meta.error}
                          />
                        </>
                      )}
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
                          name="startAddress"
                          render={({ field, meta }) => (
                            <>
                              <TextField
                                {...field}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                    fontSize: "14px",
                                    "& fieldset": {
                                      borderColor: "#d1d5db",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#9ca3af",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#3b82f6",
                                      borderWidth: "2px",
                                    },
                                  },
                                  "& .MuiInputBase-input": {
                                    color: "#374151",
                                    fontSize: "14px",
                                  },
                                }}
                                fullWidth
                                placeholder="Address *"
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                              />
                            </>
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <Autocomplete
                          value={values.startCity}
                          onChange={(event, newValue) =>
                            setFieldValue("startCity", newValue || "")
                          }
                          options={allCities}
                          freeSolo={false}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select or type city"
                              variant="outlined"
                              size="small"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                  fontSize: "14px",
                                  "& fieldset": {
                                    borderColor: "#d1d5db",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#9ca3af",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#3b82f6",
                                    borderWidth: "2px",
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  color: "#374151",
                                  fontSize: "14px",
                                },
                              }}
                            />
                          )}
                          sx={{ width: "100%", maxWidth: "220px" }}
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
                        <Autocomplete
                          value={values.startState}
                          onChange={(event, newValue) =>
                            setFieldValue("startState", newValue || "")
                          }
                          options={allStates}
                          freeSolo={false}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select or type state"
                              variant="outlined"
                              size="small"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                  fontSize: "14px",
                                  "& fieldset": {
                                    borderColor: "#d1d5db",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#9ca3af",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#3b82f6",
                                    borderWidth: "2px",
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  color: "#374151",
                                  fontSize: "14px",
                                },
                              }}
                            />
                          )}
                          sx={{ width: "100%", maxWidth: "220px" }}
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
                          name="startZipcode"
                          render={({ field, meta }) => (
                            <>
                              <TextField
                                {...field}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                    fontSize: "14px",
                                    "& fieldset": {
                                      borderColor: "#d1d5db",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#9ca3af",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#3b82f6",
                                      borderWidth: "2px",
                                    },
                                  },
                                  "& .MuiInputBase-input": {
                                    color: "#374151",
                                    fontSize: "14px",
                                  },
                                }}
                                fullWidth
                                placeholder="Zipcode *"
                                inputProps={{ maxLength: 5 }}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                              />
                            </>
                          )}
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
                          name="endAddress"
                          render={({ field, meta }) => (
                            <>
                              <TextField
                                {...field}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                    fontSize: "14px",
                                    "& fieldset": {
                                      borderColor: "#d1d5db",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#9ca3af",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#3b82f6",
                                      borderWidth: "2px",
                                    },
                                  },
                                  "& .MuiInputBase-input": {
                                    color: "#374151",
                                    fontSize: "14px",
                                  },
                                }}
                                fullWidth
                                placeholder="Address *"
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                              />
                            </>
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <Autocomplete
                          value={values.endCity}
                          onChange={(event, newValue) =>
                            setFieldValue("endCity", newValue || "")
                          }
                          options={allCities}
                          freeSolo={false}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select or type city"
                              variant="outlined"
                              size="small"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                  fontSize: "14px",
                                  "& fieldset": {
                                    borderColor: "#d1d5db",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#9ca3af",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#3b82f6",
                                    borderWidth: "2px",
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  color: "#374151",
                                  fontSize: "14px",
                                },
                              }}
                            />
                          )}
                          sx={{ width: "100%", maxWidth: "220px" }}
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
                        <Autocomplete
                          value={values.endState}
                          onChange={(event, newValue) =>
                            setFieldValue("endState", newValue || "")
                          }
                          options={allStates}
                          freeSolo={false}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select or type city"
                              variant="outlined"
                              size="small"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                  fontSize: "14px",
                                  "& fieldset": {
                                    borderColor: "#d1d5db",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#9ca3af",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#3b82f6",
                                    borderWidth: "2px",
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  color: "#374151",
                                  fontSize: "14px",
                                },
                              }}
                            />
                          )}
                          sx={{ width: "100%", maxWidth: "220px" }}
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
                          name="endZipcode"
                          render={({ field, meta }) => (
                            <>
                              <TextField
                                {...field}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                    fontSize: "14px",
                                    "& fieldset": {
                                      borderColor: "#d1d5db",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#9ca3af",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#3b82f6",
                                      borderWidth: "2px",
                                    },
                                  },
                                  "& .MuiInputBase-input": {
                                    color: "#374151",
                                    fontSize: "14px",
                                  },
                                }}
                                fullWidth
                                placeholder="Zipcode *"
                                inputProps={{ maxLength: 5 }}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                              />
                            </>
                          )}
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
                        name="stops"
                        render={({ field, meta }) => (
                          <>
                            <Select
                              {...field}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                  fontSize: "14px",
                                  "& fieldset": {
                                    borderColor: "#d1d5db",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#9ca3af",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#3b82f6",
                                    borderWidth: "2px",
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  color: "#374151",
                                  fontSize: "14px",
                                },
                              }}
                              fullWidth
                              displayEmpty
                              MenuProps={MenuProps}
                              multiple
                              value={field.value || []}
                              renderValue={(selected) => {
                                if (selected.length === 0) {
                                  return (
                                    <span style={{ color: "#9ca3af" }}>
                                      Select Stops
                                    </span>
                                  );
                                }
                                return (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {selected.map((value) => (
                                      <Chip
                                        key={value}
                                        label={value}
                                        size="small"
                                        sx={{
                                          height: "24px",
                                          fontSize: "12px",
                                        }}
                                      />
                                    ))}
                                  </Box>
                                );
                              }}
                              error={meta.touched && !!meta.error}
                            >
                              {hospitals.map((item, index) => (
                                <MenuItem key={index} value={item.name}>
                                  {item.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {meta.touched && meta.error && (
                              <div className="text-red-500 text-xs mt-1">
                                {meta.error}
                              </div>
                            )}
                          </>
                        )}
                      />
                    </div>

                    {/* Assigned Driver */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assigned Driver *
                      </label>
                      <Field
                        name="assignedDriver"
                        render={({ field, meta }) => (
                          <>
                            <Select
                              {...field}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                  fontSize: "14px",
                                  "& fieldset": {
                                    borderColor: "#d1d5db",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#9ca3af",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#3b82f6",
                                    borderWidth: "2px",
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  color: "#374151",
                                  fontSize: "14px",
                                },
                              }}
                              fullWidth
                              displayEmpty
                              MenuProps={MenuProps}
                              error={meta.touched && !!meta.error}
                            >
                              <MenuItem value="" disabled>
                                <span style={{ color: "#9ca3af" }}>
                                  Select Drivers
                                </span>
                              </MenuItem>
                              {drivers.map((driver) => (
                                <MenuItem key={driver.driver._id} value={driver.driver._id}>
                                  {driver.driver.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {meta.touched && meta.error && (
                              <div className="text-red-500 text-xs mt-1">
                                {meta.error}
                              </div>
                            )}
                          </>
                        )}
                      />
                    </div>

                    {/* ETA */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ETA *
                      </label>
                      <div className="relative">
                        <Field
                          name="eta"
                          render={({ field, meta }) => (
                            <>
                              <TextField
                                {...field}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                    fontSize: "14px",
                                    "& fieldset": {
                                      borderColor: "#d1d5db",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#9ca3af",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#3b82f6",
                                      borderWidth: "2px",
                                    },
                                  },
                                  "& .MuiInputBase-input": {
                                    color: "#374151",
                                    fontSize: "14px",
                                  },
                                }}
                                fullWidth
                                placeholder="2:10 PM"
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                              />
                            </>
                          )}
                        />
                        <Clock className="absolute right-3 top-3 transform w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Active Days */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Active Days *
                      </label>
                      <Field name="activeDays">
                        {({ field, meta }) => (
                          <>
                            <Select
                              {...field}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                  fontSize: "14px",
                                  "& fieldset": {
                                    borderColor: "#d1d5db",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#9ca3af",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#3b82f6",
                                    borderWidth: "2px",
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  color: "#374151",
                                  fontSize: "14px",
                                },
                              }}
                              fullWidth
                              displayEmpty
                              multiple
                              MenuProps={MenuProps}
                              value={field.value || []}
                              // renderValue={(selected) => {
                              //   if (selected.length === 0) {
                              //     return (
                              //       <span style={{ color: "#9ca3af" }}>
                              //         Select Active Days
                              //       </span>
                              //     );
                              //   }
                              //   return (
                              //     <Box
                              //       sx={{
                              //         display: "flex",
                              //         flexWrap: "wrap",
                              //         gap: 0.5,
                              //       }}
                              //     >
                              //       {selected.map((value) => {
                              //         const dayName =
                              //           days.find((day) => day.value === value)
                              //             ?.name || value;
                              //         return (
                              //           <Chip
                              //             key={value}
                              //             label={dayName}
                              //             size="small"
                              //             sx={{
                              //               height: "24px",
                              //               fontSize: "12px",
                              //             }}
                              //           />
                              //         );
                              //       })}
                              //     </Box>
                              //   );
                              // }}
                              renderValue={(selected) => selected.join(", ")}
                              error={meta.touched && !!meta.error}
                            >
                              {days.map((day) => (
                                <MenuItem key={day.value} value={day.value}>
                                  <Checkbox
                                    checked={field.value.includes(day.value)}
                                    onChange={() => {
                                      const newValue = field.value.includes(
                                        day.value
                                      )
                                        ? field.value.filter(
                                            (v) => v !== day.value
                                          )
                                        : [...field.value, day.value];
                                      setFieldValue(field.name, newValue);
                                    }}
                                  />
                                  {day.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {meta.touched && meta.error && (
                              <div className="text-red-500 text-xs mt-1">
                                {meta.error}
                              </div>
                            )}
                          </>
                        )}
                      </Field>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <Field
                        name="status"
                        render={({ field, meta }) => (
                          <>
                            <Select
                              {...field}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                  fontSize: "14px",
                                  "& fieldset": {
                                    borderColor: "#d1d5db",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#9ca3af",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#3b82f6",
                                    borderWidth: "2px",
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  color: "#374151",
                                  fontSize: "14px",
                                },
                              }}
                              fullWidth
                              displayEmpty
                              MenuProps={MenuProps}
                              error={meta.touched && !!meta.error}
                            >
                              <MenuItem value="" disabled>
                                <span style={{ color: "#9ca3af" }}>
                                  Select Status
                                </span>
                              </MenuItem>
                              <MenuItem value="Active">Active</MenuItem>
                              <MenuItem value="Completed">Completed</MenuItem>
                              <MenuItem value="Archive">Archive</MenuItem>
                            </Select>
                            {meta.touched && meta.error && (
                              <div className="text-red-500 text-xs mt-1">
                                {meta.error}
                              </div>
                            )}
                          </>
                        )}
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
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
                <h4 className="font-semibold text-gray-700 mb-2">
                  Route Information:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Driver:</span>
                    <p className="font-medium text-gray-400">
                      {selectedRouteData?.assignedDriver?.driver?.name ||
                        selectedRowData?.assignedDriver?.driver?.name ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-medium text-gray-400">
                      {selectedRouteData?.status || selectedRowData?.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">ETA:</span>
                    <p className="font-medium text-gray-400">
                      {selectedRouteData?.eta || selectedRowData?.eta}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Active Days:</span>
                    <p className="font-medium text-gray-400">
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

      {/* Assign Temporary Driver */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Assign Temporary Driver
              </h2>
              <button
                onClick={() => {
                  setAssignModal(false);
                  setSelectedRoute(null);
                  setSelectedDriver(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver
                  </label>
                  <select
                    name="driver"
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 disabled:bg-gray-100"
                  >
                    <option value="">
                      {loading ? "Loading drivers..." : "Select Driver"}
                    </option>
                    {drivers && drivers.length > 0
                      ? drivers.map((item) => (
                          <option key={item.driver._id} value={item.driver._id}>
                            {item.driver.name}
                          </option>
                        ))
                      : !loading && (
                          <option value="" disabled>
                            No drivers available
                          </option>
                        )}
                  </select>
                </div>

                <div className="flex w-full">
                  <button
                    onClick={assignTempDriver}
                    type="submit"
                    className="bg-secondary w-full hover:bg-secondary text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors"
                  >
                    Assign Driver
                  </button>
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
