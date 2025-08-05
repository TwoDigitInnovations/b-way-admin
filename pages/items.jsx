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
import Currency from "@/helper/currency";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserList } from "@/store/userList";

function Items({ loader, user }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const menuRef = useRef(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [items, setItems] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  // Pagination
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const router = useRouter();
  const dispatch = useDispatch();
  const { userList } = useSelector((state) => state.user);

  useEffect(() => {
    if (user.role === "ADMIN") {
      dispatch(fetchUserList("DISPATCHER"));
    }
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("Item name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be non-negative"),
    category: Yup.string().required("Category is required"),
    stock: Yup.number()
      .required("Stock quantity is required")
      .min(0, "Stock must be non-negative"),
    pickupLocation: Yup.object({
      address: Yup.string().required("Pickup address is required"),
      city: Yup.string().required("Pickup city is required"),
      state: Yup.string().required("Pickup state is required"),
      zipCode: Yup.string()
        .matches(/^\d{5}$/, "Zip code must be exactly 5 digits")
        .required("Zip code is required"),
    }),
    status: Yup.string().required("Status is required"),
  });

  const handleSubmitItem = (values, { resetForm }) => {
    loader(true);

    // Transform the data to match backend expectations
    const itemData = {
      name: values.name,
      description: values.description,
      price: values.price,
      category: values.category,
      stock: values.stock,
      pickupLocation: {
        address: values.pickupLocation.address,
        city: values.pickupLocation.city,
        state: values.pickupLocation.state,
        zipCode: values.pickupLocation.zipCode,
      },
      status: values.status,
    };

    const isEditing = selectedItem && selectedItem._id;
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/item/${selectedItem._id}` : "/item/create";
    const successMessage = isEditing ? "Item updated successfully!" : "Item created successfully!";

    Api(method, url, itemData, router)
      .then((response) => {
        if (response?.status) {
          toast.success(successMessage);
          setShowEditModal(false);
          setSelectedItem(null); // Clear selected item
          resetForm(); // Reset form data
          // Refresh the items list without showing separate loader
          fetchItems(false);
        } else {
          toast.error(`Failed to ${isEditing ? 'update' : 'create'} item. Please try again.`);
        }
      })
      .catch((error) => {
        console.error(`Error ${isEditing ? 'updating' : 'creating'} item:`, error);
        toast.error(`An error occurred while ${isEditing ? 'updating' : 'creating'} the item.`);
      })
      .finally(() => {
        loader(false);
      });
  };

  const getMenuItems = (item) => [
    {
      label: "View",
      icon: <Eye className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("View clicked", item);
        handleViewClick(item._id);
      },
    },
    {
      label: "Edit",
      icon: <Edit3 className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("Edit clicked", item);
        handleEditClick(item);
      },
    },
    // {
    //   label: "Download Return Load",
    //   icon: <Download className="w-5 h-5 text-gray-500" />,
    //   command: () => {
    //     console.log("Download Return Load clicked", item);
    //   },
    // },
    ...(user.role === "ADMIN" || user.role === "DISPATCHER"
      ? [
          {
            label: "Delete",
            icon: <Trash className="w-5 h-5 text-gray-500" />,
            command: () => {
              console.log("Delete clicked", item);
              handleDeleteItem(item._id);
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
    Api("GET", `/item/${id}`)
      .then((res) => {
        if (res?.data) {
          setSelectedItem(res.data);
        } else if (res?.status && res?.data) {
          setSelectedItem(res.data);
        }
      })
      .catch((err) => {
        toast.error(
          err?.message || "Failed to fetch item details. Please try again."
        );
      })
      .finally(() => {
        loader(false);
      });
  };

  const handleEditClick = (item) => {
    // setSelectedItem(item);
    setShowEditModal(true);
    setActiveDropdown(null);
    fetchUserDetails(item?._id);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown-menu")) {
      setActiveDropdown(null);
    }
  };

  const handleDeleteItem = (itemId) => {
    loader(true);
    Api("DELETE", `/item/${itemId}`)
      .then((res) => {
        if (res.status) {
          toast.success("Item deleted successfully.");
          setItems((prevItems) =>
            prevItems.filter((item) => item._id !== itemId)
          );
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        toast.error("An error occurred while deleting the item.");
      })
      .finally(() => {
        loader(false);
      });
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchItems = async (showLoader = true) => {
    if (showLoader) {
      loader(true);
    }
    try {
      const response = await Api(
        "GET",
        `/item?page=${currentPage}&limit=${limit}`,
        null,
        router
      );

      if (response.status) {
        setItems(response.data);
        setTotalItems(response.total);
        setCurrentPage(response.page);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      if (showLoader) {
        loader(false);
      }
    }
  };

  const openAddModal = () => {
    setSelectedItem(null);
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, limit]);

  const handlePageChange = (event) => {
    setCurrentPage(event.page + 1);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Available: "bg-green-100 text-green-800 border border-green-200",
      "Out of Stock": "bg-red-100 text-red-800 border border-red-200",
      Discontinued: "bg-gray-100 text-gray-800 border border-gray-200",
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
    <Layout title="Items">
      <div className="bg-white shadow-sm overflow-hidden rounded-lg">
        <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">All Items</span>
          <button onClick={openAddModal} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700">
            Add New
          </button>
        </div>
        <DataTable
          value={items}
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
          rowClassName={() => "hover:bg-gray-50"}
          size="small"
          paginator
          rows={limit}
          totalRecords={totalItems}
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
            header="Item Name"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          {/* <Column
            field="description"
            header="Description"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          /> */}
          <Column
            field="category"
            header="Category"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="stock"
            header="Stock"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="price"
            header="Price"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => (
              <span>{Currency(rowData?.price) || "0.00"}</span>
            )}
          />
          <Column
            field="pickupLocation"
            header="Pickup Location"
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
            field="dispatcher"
            header="Dispatcher"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData) => (
              <span>{rowData?.dispatcher?.name || "N/A"}</span>
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

      {/* Edit/Add Item Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#003C72]">
                {selectedItem ? "Edit Item" : "Add Item"}
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <Formik
              key={selectedItem?._id || "new"} // Force reinitialize when item changes
              initialValues={{
                name: selectedItem?.name || "",
                description: selectedItem?.description || "",
                price: selectedItem?.price || "",
                category: selectedItem?.category || "",
                stock: selectedItem?.stock || "",
                pickupLocation: {
                  address: selectedItem?.pickupLocation?.address || "",
                  city: selectedItem?.pickupLocation?.city || "",
                  state: selectedItem?.pickupLocation?.state || "",
                  zipCode: selectedItem?.pickupLocation?.zipCode || "",
                },
                status: selectedItem?.status || "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmitItem}
              enableReinitialize={true} // Allow form to reinitialize when initialValues change
            >
              {({
                handleChange,
                handleBlur,
                values,
                handleSubmit,
                errors,
                touched,
              }) => (
                <form onSubmit={handleSubmit}>
                  {/* Modal Content */}
                  <div className="p-4 sm:p-6">
                    {/* Item Name and Description Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          placeholder="Item Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                        />
                        <span className="text-sm text-red-600">
                          {errors.name && touched.name && errors.name}
                        </span>
                      </div>
                      {user?.role === "ADMIN" && (
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
                            <option value="Available">Available</option>
                            <option value="Out of Stock">Out of Stock</option>
                            <option value="Discontinued">Discontinued</option>
                          </select>
                          <span className="text-sm text-red-600">
                            {errors.status && touched.status && errors.status}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price, Category, and Stock Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={values.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                        />
                        <span className="text-sm text-red-600">
                          {errors.price && touched.price && errors.price}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={values.category}
                          onChange={handleChange}
                          placeholder="Category"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                        />
                        <span className="text-sm text-red-600">
                          {errors.category &&
                            touched.category &&
                            errors.category}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={values.stock}
                          onChange={handleChange}
                          placeholder="Stock"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                        />
                        <span className="text-sm text-red-600">
                          {errors.stock && touched.stock && errors.stock}
                        </span>
                      </div>
                      {user?.role === "ADMIN" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dispatcher
                        </label>
                        <select
                          name="dispatcher"
                          value={values.dispatcher || ""}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                        >
                          <option value="">Select Dispatcher</option>
                          {userList?.map((dispatcher) => (
                            <option key={dispatcher._id} value={dispatcher._id}>
                              {dispatcher.name}
                            </option>
                          ))}
                        </select>
                        {/* <input
                          type="text"
                          name="dispatcher"
                          value={values.dispatcher}
                          onChange={handleChange}
                          placeholder="Dispatcher"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                        /> */}
                        <span className="text-sm text-red-600">
                          {errors.stock && touched.stock && errors.stock}
                        </span>
                      </div>
                      )}
                      <div className="col-span-1 md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={values.description}
                          onChange={handleChange}
                          placeholder="Item Description"
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                        />
                        <span className="text-sm text-red-600">
                          {errors.description &&
                            touched.description &&
                            errors.description}
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
                          <input
                            type="text"
                            name="pickupLocation.city"
                            value={values.pickupLocation.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                            placeholder="City"
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
                          <input
                            type="text"
                            name="pickupLocation.state"
                            value={values.pickupLocation.state}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                            placeholder="State"
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
                            name="pickupLocation.zipCode"
                            value={values.pickupLocation.zipCode}
                            onChange={handleChange}
                            placeholder="Zipcode"
                            maxLength={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                          />
                          <span className="text-sm text-red-600">
                            {errors.pickupLocation?.zipCode &&
                              touched.pickupLocation?.zipCode &&
                              errors.pickupLocation.zipCode}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-start">
                      <button
                        type="submit"
                        className="bg-secondary hover:bg-secondary text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors"
                      >
                        {selectedItem ? "Update Item" : "Create Item"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {viewModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Item Details
              </h2>
              <button
                onClick={() => {
                  setViewModal(false);
                  setSelectedItem(null);
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
                      Item Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedItem.name || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Category
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedItem.category || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      ${selectedItem.price || "0.00"}
                    </dd>
                  </div>
                  <div className="col-span-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">Stock</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedItem.stock || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-2 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedItem.status || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-6 py-3 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500 sm:col-span-1">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-5">
                      {selectedItem.description || "N/A"}
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
                      {selectedItem?.pickupLocation?.address || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Pickup City
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedItem?.pickupLocation?.city || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Pickup State
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedItem?.pickupLocation?.state || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Pickup Zipcode
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedItem?.pickupLocation?.zipCode || "N/A"}
                    </dd>
                  </div>
                  <h2 className="col-span-6 text-md font-semibold text-[#003C72] py-3">
                    Dispatcher Details
                  </h2>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Dispatcher Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedItem?.dispatcher?.name || "N/A"}
                    </dd>
                  </div>
                  <div className="col-span-3 pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                    <dt className="text-sm font-medium text-gray-500">
                      Dispatcher Email
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedItem?.dispatcher?.email || "N/A"}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Additional details can be added here */}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Items;
