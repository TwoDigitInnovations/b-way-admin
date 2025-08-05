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
  Trash,
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
import toast from "react-hot-toast";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrivers } from "@/store/driverSlice";
import { fetchRoutes } from "@/store/routeSlice";
import { AutoComplete } from "primereact/autocomplete";
import { getStateAndCityPicklist } from "@/utils/states";
import { fetchItems } from "@/store/itemSlice";

function Orders({ loader, user }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const menuRef = useRef(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  // Pagination
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [limit] = useState(10);
  const { routes, assignedRoute, loading, error } = useSelector(
    (state) => state.route
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const { items } = useSelector((state) => state.item);

  const statesAndCities = getStateAndCityPicklist();
  const allCities = Object.values(statesAndCities).flat();
  const allStates = Object.keys(statesAndCities);
  const [filteredPickupCities, setFilteredPickupCities] = useState(allCities);
  const [filteredPickupStates, setFilteredPickupStates] = useState(allStates);
  const [filteredDeliveryCities, setFilteredDeliveryCities] =
    useState(allCities);
  const [filteredDeliveryStates, setFilteredDeliveryStates] =
    useState(allStates);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    dispatch(fetchRoutes({ page: 0, limit: 0 }));
    dispatch(fetchItems());
    console.log("Routes fetched");
  }, [dispatch]);

  // Initialize filtered items when items are loaded
  useEffect(() => {
    if (items && Array.isArray(items)) {
      setFilteredItems(items);
    }
  }, [items]);

  // Add useEffect to log routes when they change
  useEffect(() => {
    console.log("Routes from Redux:", routes);
    console.log("Routes loading:", loading);
    console.log("Routes error:", error);
  }, [routes, loading, error]);

  const validationSchema = Yup.object({
    items: Yup.string().required("Item(s) is required"),
    qty: Yup.number()
      .required("Quantity is required")
      .min(1, "Must be at least 1")
      .positive("Quantity must be positive"),
    pickupLocation: Yup.object({
      address: Yup.string().required("Pickup address is required"),
      city: Yup.string().required("Pickup city is required"),
      state: Yup.string().required("Pickup state is required"),
      zipcode: Yup.string()
        .matches(/^\d{5}$/, "Pickup zipcode must be exactly 5 digits")
        .required("Pickup zipcode is required"),
    }),
    deliveryLocation: Yup.object({
      address: Yup.string().required("Delivery address is required"),
      city: Yup.string().required("Delivery city is required"),
      state: Yup.string().required("Delivery state is required"),
      zipcode: Yup.string()
        .matches(/^\d{5}$/, "Delivery zipcode must be exactly 5 digits")
        .required("Delivery zipcode is required"),
    }),
    status: Yup.string().when([], {
      is: () => user?.role === "ADMIN",
      then: (schema) => schema.required("Status is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleUpdateOrder = (values, { resetForm }) => {
    loader(true);

    // Transform the data to match backend expectations
    const orderData = {
      items: values.items,
      qty: parseInt(values.qty, 10),
      pickupLocation: {
        address: values.pickupLocation.address,
        city: values.pickupLocation.city,
        state: values.pickupLocation.state,
        zipcode: values.pickupLocation.zipcode,
      },
      deliveryLocation: {
        address: values.deliveryLocation.address,
        city: values.deliveryLocation.city,
        state: values.deliveryLocation.state,
        zipcode: values.deliveryLocation.zipcode,
      },
      ...(values.eta && { eta: values.eta }),
      ...(values.status && { status: values.status }),
    };

    Api("PUT", `/order/${selectedOrder._id}`, orderData, router)
      .then((response) => {
        if (response?.status) {
          toast.success("Order updated successfully!");
          setShowEditModal(false);
          setSelectedOrder(null); // Clear selected order
          resetForm(); // Reset form data
          // Refresh the orders list without showing separate loader
          fetchOrders(false);
        } else {
          toast.error("Failed to update order. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error updating order:", error);
        toast.error("An error occurred while updating the order.");
      })
      .finally(() => {
        loader(false);
      });
  };

  const getMenuItems = (order) => [
    {
      label: "View",
      icon: <Eye className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("View clicked", order);
        handleViewClick(order._id);
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
    ...(user.role !== "USER"
      ? [
          {
            label: "Assign Route",
            icon: <UserPlus className="w-5 h-5 text-gray-500" />,
            command: () => {
              console.log("Assign clicked", order);
              handleAssign(order);
            },
          },
        ]
      : []),
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
    ...(user.role === "USER"
      ? [
          {
            label: "Delete",
            icon: <Trash className="w-5 h-5 text-gray-500" />,
            command: () => {
              console.log("Delete clicked", order);
              handleDeleteOrder(order._id);
            },
          },
        ]
      : []),
  ];

  const handleViewClick = (id) => {
    console.log("View clicked", id);
    setViewModal(true);
    fetchUserDetails(id);
  };

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

  const fetchUserDetails = (id) => {
    loader(true);
    Api("GET", `/order/${id}`)
      .then((res) => {
        if (res?.data) {
          setSelectedOrder(res.data);
        } else if (res?.status && res?.data) {
          setSelectedOrder(res.data);
        }
      })
      .catch((err) => {
        toast.error(
          err?.message || "Failed to fetch user details. Please try again."
        );
      })
      .finally(() => {
        loader(false);
      });
  };

  const handleEditClick = (order) => {
    // setSelectedOrder(order);
    setShowEditModal(true);
    setActiveDropdown(null);
    fetchUserDetails(order?._id);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown-menu")) {
      setActiveDropdown(null);
    }
  };

  const handleDeleteOrder = (orderId) => {
    loader(true);
    Api("DELETE", `/order/${orderId}`)
      .then((res) => {
        if (res.status) {
          toast.success("Order deleted successfully.");
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order._id !== orderId)
          );
        }
      })
      .catch((error) => {
        console.error("Error deleting order:", error);
        toast.error("An error occurred while deleting the order.");
      })
      .finally(() => {
        loader(false);
      });
  };

  const handleAssign = (order) => {
    setAssignModal(true);
    setSelectedOrder(order);
  };

  const assignRoute = () => {
    if (!selectedRoute) {
      toast.error("Please select a route to assign.");
      return;
    }

    loader(true);
    const data = {
      route: selectedRoute,
    };
    Api("PUT", `/order/${selectedOrder._id}`, data, router)
      .then((res) => {
        if (res.status) {
          toast.success("Route assigned successfully.");
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === selectedOrder._id
                ? { ...order, route: selectedRoute }
                : order
            )
          );
          fetchOrders(false); // Refresh orders list
        }
      })
      .catch((error) => {
        console.error("Error assigning route:", error);
        toast.error("An error occurred while assigning the route.");
      })
      .finally(() => {
        loader(false);
        setSelectedOrder(null);
        setAssignModal(false);
        setSelectedRoute("");
      });
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchOrders = async (showLoader = true) => {
    if (showLoader) {
      loader(true);
    }
    try {
      // Use user-specific endpoint for regular users, admin endpoint for admins
      const endpoint =
        user?.role === "ADMIN"
          ? `/order?page=${currentPage}&limit=${limit}`
          : `/order/my-orders?page=${currentPage}&limit=${limit}`;

      const response = await Api("GET", endpoint, null, router);

      if (response.status) {
        setOrders(response.data);
        setTotalOrders(response.totalOrders);
        setCurrentPage(response.currentPage);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      if (showLoader) {
        loader(false);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, limit]);

  // // Refetch orders when user changes
  // useEffect(() => {
  //   if (user) {
  //     fetchOrders();
  //   }
  // }, [user]);

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

  // Autocomplete search for pickup city
  const searchPickupCities = (event) => {
    let filtered = [];
    if (!event.query || event.query.length === 0) {
      filtered = allCities;
    } else {
      filtered = allCities.filter((city) =>
        city.toLowerCase().includes(event.query.toLowerCase())
      );
    }
    setFilteredPickupCities(filtered);
  };
  // Autocomplete search for pickup state
  const searchPickupStates = (event) => {
    let filtered = [];
    if (!event.query || event.query.length === 0) {
      filtered = allStates;
    } else {
      filtered = allStates.filter((state) =>
        state.toLowerCase().includes(event.query.toLowerCase())
      );
    }
    setFilteredPickupStates(filtered);
  };
  // Autocomplete search for delivery city
  const searchDeliveryCities = (event) => {
    let filtered = [];
    if (!event.query || event.query.length === 0) {
      filtered = allCities;
    } else {
      filtered = allCities.filter((city) =>
        city.toLowerCase().includes(event.query.toLowerCase())
      );
    }
    setFilteredDeliveryCities(filtered);
  };
  // Autocomplete search for delivery state
  const searchDeliveryStates = (event) => {
    let filtered = [];
    if (!event.query || event.query.length === 0) {
      filtered = allStates;
    } else {
      filtered = allStates.filter((state) =>
        state.toLowerCase().includes(event.query.toLowerCase())
      );
    }
    setFilteredDeliveryStates(filtered);
  };
  // Autocomplete search for items
  const searchItems = (event) => {
    let filtered = [];
    if (!event.query || event.query.length === 0) {
      filtered = items || [];
    } else {
      filtered = (items || []).filter((item) =>
        item && item.name && item.name.toLowerCase().includes(event.query.toLowerCase())
      );
    }
    setFilteredItems(filtered);
  };

  return (
    <Layout title="Orders">
      <div className="bg-white shadow-sm overflow-hidden rounded-lg">
        <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            {user?.role === "ADMIN" ? "All Orders" : "My Orders"}
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
          {user?.role === "ADMIN" && (
            <Column
              field="facilityName"
              header="Facility"
              bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
              body={(rowData) => (
                <span style={{ color: "#374151", fontWeight: 500 }}>
                  {rowData.user?.name || "N/A"}
                </span>
              )}
            />
          )}
          <Column
            field="items"
            header="Item(s)"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => (
              <span>
                {Array.isArray(rowData.items)
                  ? rowData.items.map((item) => item?.name).join(", ")
                  : rowData.items?.name || "N/A"}
              </span>
            )}
          />
          <Column
            field="qty"
            header="Qty"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="pickupLocation"
            header="Pickup"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => (
              <span>
                {rowData?.pickupLocation
                  ? rowData?.pickupLocation?.address
                  : "N/A"}
              </span>
            )}
          />
          <Column
            field="deliveryLocation"
            header="Delivery"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => (
              <span>{rowData?.deliveryLocation?.address}</span>
            )}
          />
          <Column
            field="route"
            header="Route"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => (
              <span>{rowData?.route ? rowData?.route?.routeName : "N/A"}</span>
            )}
          />
          <Column
            field="status"
            header="Status"
            body={(rowData) => getStatusBadge(rowData.status)}
            style={{ width: "80px" }}
          />
          <Column
            field="eta"
            header="ETA"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => <span>{rowData.eta ? rowData.eta : "N/A"}</span>}
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
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Order
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedOrder(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <Formik
              key={selectedOrder?._id || "new"} // Force reinitialize when order changes
              initialValues={{
                items: Array.isArray(selectedOrder?.items) 
                  ? selectedOrder.items[0]?._id || ""
                  : selectedOrder?.items?._id || selectedOrder?.items || "",
                qty: selectedOrder?.qty || "",
                pickupLocation: {
                  address: selectedOrder?.pickupLocation?.address || "",
                  city: selectedOrder?.pickupLocation?.city || "",
                  state: selectedOrder?.pickupLocation?.state || "",
                  zipcode: selectedOrder?.pickupLocation?.zipcode || "",
                },
                deliveryLocation: {
                  address: selectedOrder?.deliveryLocation?.address || "",
                  city: selectedOrder?.deliveryLocation?.city || "",
                  state: selectedOrder?.deliveryLocation?.state || "",
                  zipcode: selectedOrder?.deliveryLocation?.zipcode || "",
                },
                route: selectedOrder?.route?._id || "",
                status: selectedOrder?.status || "",
                eta: selectedOrder?.eta || "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleUpdateOrder}
              enableReinitialize={true} // Allow form to reinitialize when initialValues change
            >
              {({
                handleChange,
                handleBlur,
                values,
                handleSubmit,
                errors,
                touched,
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>
                  {/* Modal Content */}
                  <div className="p-4 sm:p-6">
                    {/* Item(S) and Qty Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item(S)
                        </label>
                        <AutoComplete
                          value={
                            // If values.items is an ID, find the item object
                            typeof values.items === 'string' 
                              ? filteredItems.find(item => item._id === values.items) || null
                              : values.items || null
                          }
                          suggestions={filteredItems}
                          completeMethod={searchItems}
                          onDropdownClick={() => {
                            if (items && Array.isArray(items)) {
                              setFilteredItems(items);
                            }
                          }}
                          field="name"
                          onChange={(e) => {
                            // Store the item ID in the form
                            const selectedItem = e.value;
                            setFieldValue("items", selectedItem?._id || "");
                          }}
                          dropdown
                          placeholder="Select or type item"
                          inputClassName="w-full max-w-[220px] px-3 py-2 min-h-[40px] border border-gray-300 rounded-md focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700"
                          className="w-full max-w-[220px]"
                          panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                          itemTemplate={(item) => (
                            <div className="px-3 py-2 hover:bg-gray-100 text-sm">
                              {item?.name || 'Unknown Item'}
                            </div>
                          )}
                          emptyTemplate={() => (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No items found
                            </div>
                          )}
                        />
                        <span className="text-sm text-red-600">
                          {errors.items && touched.items && errors.items}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Qty
                        </label>
                        <input
                          type="number"
                          name="qty"
                          value={values.qty}
                          onChange={handleChange}
                          placeholder="Qty"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                        />
                        <span className="text-sm text-red-600">
                          {errors.qty && touched.qty && errors.qty}
                        </span>
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
                            name="pickupLocation.address"
                            value={values.pickupLocation.address}
                            onChange={handleChange}
                            placeholder="Address"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                          />
                          <span className="text-sm text-red-600">
                            {errors.pickupLocation?.address &&
                              touched.pickupLocation?.address &&
                              errors.pickupLocation.address}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <AutoComplete
                            value={values.pickupLocation.city}
                            suggestions={filteredPickupCities}
                            completeMethod={searchPickupCities}
                            onDropdownClick={() => {
                              setFilteredPickupCities(allCities);
                            }}
                            onChange={(e) =>
                              setFieldValue("pickupLocation.city", e.value)
                            }
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
                            emptyTemplate={() => (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No cities found
                              </div>
                            )}
                          />
                          <span className="text-sm text-red-600">
                            {errors.pickupLocation?.city &&
                              touched.pickupLocation?.city &&
                              errors.pickupLocation.city}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <AutoComplete
                            value={values.pickupLocation.state}
                            suggestions={filteredPickupStates}
                            completeMethod={searchPickupStates}
                            onDropdownClick={() => {
                              setFilteredPickupStates(allStates);
                            }}
                            onChange={(e) =>
                              setFieldValue("pickupLocation.state", e.value)
                            }
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
                            emptyTemplate={() => (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No states found
                              </div>
                            )}
                          />
                          <span className="text-sm text-red-600">
                            {errors.pickupLocation?.state &&
                              touched.pickupLocation?.state &&
                              errors.pickupLocation.state}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zipcode
                          </label>
                          <input
                            type="text"
                            name="pickupLocation.zipcode"
                            value={values.pickupLocation.zipcode}
                            onChange={handleChange}
                            placeholder="Zipcode"
                            maxLength={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                          />
                          <span className="text-sm text-red-600">
                            {errors.pickupLocation?.zipcode &&
                              touched.pickupLocation?.zipcode &&
                              errors.pickupLocation.zipcode}
                          </span>
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
                            name="deliveryLocation.address"
                            value={values.deliveryLocation.address}
                            onChange={handleChange}
                            placeholder="Address"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                          />
                          <span className="text-sm text-red-600">
                            {errors.deliveryLocation?.address &&
                              touched.deliveryLocation?.address &&
                              errors.deliveryLocation.address}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <AutoComplete
                            value={values.deliveryLocation.city}
                            suggestions={filteredDeliveryCities}
                            completeMethod={searchDeliveryCities}
                            onDropdownClick={() => {
                              setFilteredDeliveryCities(allCities);
                            }}
                            onChange={(e) =>
                              setFieldValue("deliveryLocation.city", e.value)
                            }
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
                            emptyTemplate={() => (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No cities found
                              </div>
                            )}
                          />
                          <span className="text-sm text-red-600">
                            {errors.deliveryLocation?.city &&
                              touched.deliveryLocation?.city &&
                              errors.deliveryLocation.city}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <AutoComplete
                            value={values.deliveryLocation.state}
                            suggestions={filteredDeliveryStates}
                            completeMethod={searchDeliveryStates}
                            onDropdownClick={() => {
                              setFilteredDeliveryStates(allStates);
                            }}
                            onChange={(e) =>
                              setFieldValue("deliveryLocation.state", e.value)
                            }
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
                            emptyTemplate={() => (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No states found
                              </div>
                            )}
                          />
                          <span className="text-sm text-red-600">
                            {errors.deliveryLocation?.state &&
                              touched.deliveryLocation?.state &&
                              errors.deliveryLocation.state}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zipcode
                          </label>
                          <input
                            type="text"
                            name="deliveryLocation.zipcode"
                            value={values.deliveryLocation.zipcode}
                            onChange={handleChange}
                            placeholder="Zipcode"
                            maxLength={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                          />
                          <span className="text-sm text-red-600">
                            {errors.deliveryLocation?.zipcode &&
                              touched.deliveryLocation?.zipcode &&
                              errors.deliveryLocation.zipcode}
                          </span>
                        </div>
                      </div>
                    </div>
                    {user?.role === "ADMIN" && (
                      <div className="my-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Status
                            </label>
                            <select
                              name="status"
                              value={values.status}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                            >
                              <option value="">Select Status</option>
                              <option value="Pending">Pending</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value={"Delivered"}>Delivered</option>
                              <option value={"Picked Up"}>Picked Up</option>
                              <option value={"Scheduled"}>Scheduled</option>
                              <option value={"Return Created"}>
                                Return Created
                              </option>
                              <option value={"Invoice Generated"}>
                                Invoice Generated
                              </option>
                            </select>
                            <span className="text-sm text-red-600">
                              {errors.status && touched.status && errors.status}
                            </span>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ETA
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="eta"
                                value={values.eta}
                                onChange={handleChange}
                                placeholder="2:10 PM"
                                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                              />
                              <Clock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Submit Button */}
                    <div className="flex justify-start">
                      <button
                        type="submit"
                        className="bg-secondary hover:bg-secondary text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors"
                      >
                        Update Order
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {viewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Order Details
              </h2>
              <button
                onClick={() => {
                  setViewModal(false);
                  setSelectedOrder(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="bg-white">
                <dl className="w-full grid grid-cols-6 gap-4">
                  <div className="col-span-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Order ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedOrder.orderId || "N/A"}
                    </dd>
                  </div>
                  {selectedOrder.user && (
                    <div className="col-span-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                      <dt className="text-sm font-medium text-gray-500">
                        Facility Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {selectedOrder.user.name || "N/A"}
                      </dd>
                    </div>
                  )}
                  <div className="col-span-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Item(s)
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {Array.isArray(selectedOrder.items)
                        ? selectedOrder.items
                            .map((item) => item?.name)
                            .join(", ")
                        : selectedOrder.items?.name || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Quantity
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedOrder.qty || "N/A"}
                    </dd>
                  </div>
                  <h2 className="col-span-6 text-md font-semibold text-[#003C72] py-2">
                    Pickup Location
                  </h2>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Pickup Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedOrder?.pickupLocation?.address || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Pickup City
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedOrder?.pickupLocation?.city || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Pickup State
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedOrder?.pickupLocation?.state || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Pickup Zipcode
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedOrder?.pickupLocation?.zipcode || "N/A"}
                    </dd>
                  </div>
                  <h2 className="col-span-6 text-md font-semibold text-[#003C72] py-3">
                    Delivery Location
                  </h2>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Delivery Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedOrder?.deliveryLocation?.address || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Delivery City
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedOrder?.deliveryLocation?.city || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Delivery State
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedOrder?.deliveryLocation?.state || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Delivery Zipcode
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedOrder?.deliveryLocation?.zipcode || "N/A"}
                    </dd>
                  </div>
                  <h2 className="col-span-6 text-md font-semibold text-[#003C72] py-3">
                    Other Details
                  </h2>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedOrder?.status || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">ETA</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedOrder?.eta || "N/A"}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Additional details can be added here */}
            </div>
          </div>
        </div>
      )}

      {assignModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Assign Route
              </h2>
              <button
                onClick={() => {
                  setAssignModal(false);
                  setSelectedOrder(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              {/* Item(S) and Qty Row */}
              <div className="grid gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Route
                  </label>
                  <select
                    name="route"
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 disabled:bg-gray-100"
                  >
                    <option value="">
                      {loading ? "Loading routes..." : "Select Route"}
                    </option>
                    {routes && routes.length > 0
                      ? routes.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.routeName}
                          </option>
                        ))
                      : !loading && (
                          <option value="" disabled>
                            No routes available
                          </option>
                        )}
                  </select>
                </div>

                {/* Submit Button */}
                <div className="flex w-full">
                  <button
                    onClick={assignRoute}
                    type="submit"
                    className="bg-secondary w-full hover:bg-secondary text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors"
                  >
                    Assign Route
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

export default Orders;
