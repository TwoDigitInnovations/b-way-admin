import React, { useEffect, useMemo, useState } from "react";
import { Clock, PlusIcon, Trash2Icon } from "lucide-react";
import Layout from "@/components/layout";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Api } from "@/helper/service";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { fetchItems } from "@/store/itemSlice";
import { getStateAndCityPicklist, getStateByCity } from "@/utils/states";
import { AutoComplete } from "primereact/autocomplete";
import Dropdown from "@/components/dropDown";
import Link from "next/link";

export default function NewOrder({ loader, user }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentItemInput, setCurrentItemInput] = useState("");
  const [currentQty, setCurrentQty] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { items } = useSelector((state) => state.item);
  const statesAndCities = getStateAndCityPicklist();
  const allCities = Object.values(statesAndCities).flat();
  const allStates = Object.keys(statesAndCities);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCurrentItem, setSelectedCurrentItem] = useState(null);
  const [maxQty, setMaxQty] = useState(0);

  useEffect(() => {
    dispatch(fetchItems());
    // Initialize filtered cities and states with all options
    setFilteredCities(allCities);
    setFilteredStates(allStates);
  }, [dispatch]);

  useEffect(() => {
    if (items?.length > 0) {
      console.log("Items loaded:", items.length);
      setFilteredItems(items); // Initialize with all items
    }
  }, [items]);

  const validationSchema = Yup.object({
    // Validation will be handled for the selectedItems array
  });

  const initialValues = {
    // Form values are now managed by selectedItems state
  };

  // Helper functions for managing multiple items
  const addItem = () => {
    if (!selectedCurrentItem || !currentQty || parseInt(currentQty) < 1) {
      toast.error("Please select an item and enter a valid quantity");
      return;
    }

    if (currentQty > maxQty) {
      toast.error(`Maximum quantity for this item is ${maxQty}`);
      return;
    }

    const newItem = {
      id: Date.now(),
      itemId: selectedCurrentItem._id,
      name: selectedCurrentItem.name,
      qty: parseInt(currentQty),
      price: Number(selectedCurrentItem.price),
      pickupLocation: selectedCurrentItem.pickupLocation,
      stock: selectedCurrentItem.stock,
    };

    setSelectedItems([...selectedItems, newItem]);
    setCurrentItemInput("");
    setCurrentQty("");
    setSelectedCurrentItem(null);
    setFilteredItems(items);
    setMaxQty(0);
    toast.success("Item added successfully");
  };

  const removeItem = (itemId) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
    toast.success("Item removed successfully");
  };

  const updateItemQty = (itemId, newQty) => {
    if (newQty < 1) return;
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === itemId ? { ...item, qty: parseInt(newQty) } : item
      )
    );
  };

  const handleSubmit = (values, { resetForm }) => {
    if (selectedItems.length === 0) {
      toast.error("Please add at least one item to the order");
      return;
    }

    console.log("Form submitted with items:", selectedItems);
    loader(true);

    // Transform the data to match backend expectations
    const orderData = {
      items: selectedItems.map((item) => ({
        itemId: item.itemId,
        qty: item.qty,
        price: item.price,
        pickupLocation: item.pickupLocation.address,
        pickupCity: item.pickupLocation.city,
        pickupState: item.pickupLocation.state,
        pickupZipcode: item.pickupLocation.zipcode,
      })),
    };

    Api("POST", "/order/create", orderData, router)
      .then((response) => {
        console.log("Order created successfully:", response);
        if (response?.status) {
          toast.success("Order created successfully!");
          resetForm();
          setSelectedItems([]);
          setCurrentItemInput("");
          setCurrentQty("");
          setSelectedCurrentItem(null);
          //   router.push("/ordersv");
        } else {
          toast.error("Failed to create order. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        toast.error(
          error.message || "An error occurred while creating the order."
        );
      })
      .finally(() => {
        loader(false);
      });
  };

  const searchCities = (event) => {
    let filtered = [];
    if (event.query.length === 0) {
      filtered = allCities; // Show all cities when no query
    } else {
      filtered = allCities.filter((city) =>
        city.toLowerCase().includes(event.query.toLowerCase())
      );
    }
    setFilteredCities(filtered);
  };

  const searchStates = (event) => {
    let filtered = [];
    if (event.query.length === 0) {
      filtered = allStates;
    } else {
      filtered = allStates.filter((state) =>
        state.toLowerCase().includes(event.query.toLowerCase())
      );
    }
    setFilteredStates(filtered);
  };

  const itemList = useMemo(
    () =>
      items.map((item) => ({
        ...item,
      })),
    [items]
  );

  const searchItems = (event) => {
    const query = event.query.toLowerCase();
    const _filteredItems = itemList.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setFilteredItems(_filteredItems);
  };

  return (
    <Layout title={"Create New Order"}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          values,
          handleSubmit,
          errors,
          touched,
        }) => (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white shadow-sm border border-gray-200 p-4 mb-4 lg:mb-6 rounded-lg">
              {/* Modal Content */}
              <h2 className="text-lg font-semibold text-blue-900 pb-4 mb-4 border-b border-gray-200">
                Create New Order
              </h2>
              <div className="p-4 sm:p-6">
                {/* Item(S) and Qty Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item(S)
                    </label>
                    {/* <Dropdown data={items} value={currentItemInput} selected={handleItemSelect} changed={handleItemChange} /> */}
                    <AutoComplete
                      value={currentItemInput}
                      suggestions={filteredItems}
                      completeMethod={searchItems}
                      field="name"
                      // onDropdownClick={() => {
                      //   console.log("Dropdown clicked, setting all items");
                      //   setFilteredItems(items || []);
                      // }}
                      // onFocus={() => {
                      //   console.log("AutoComplete focused, ensuring items are available");
                      //   if (!filteredItems || filteredItems.length === 0) {
                      //     setFilteredItems(items || []);
                      //   }
                      // }}
                      onChange={(e) => {
                        setCurrentItemInput(e.value);
                      }}
                      onSelect={(e) => {
                        const selectedItem = e.value;
                        setCurrentItemInput(selectedItem.name);
                        setSelectedCurrentItem(selectedItem);
                        console.log("Selected item:", selectedItem.stock);
                        setMaxQty(selectedItem.stock || 0);
                      }}
                      dropdown
                      placeholder="Select or type item"
                      inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700"
                      className="w-full"
                      panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qty
                    </label>
                    <input
                      type="number"
                      value={currentQty}
                      onChange={(e) => setCurrentQty(e.target.value)}
                      placeholder="Qty"
                      min="1"
                      max={maxQty > 0 ? maxQty : undefined}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={addItem}
                      className="bg-secondary hover:bg-secondary text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors cursor-pointer h-10"
                    >
                      <PlusIcon className="h-5 w-5 inline-block mr-2" />
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Selected Items List */}
                {selectedItems.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-800 mb-3">
                      Selected Items ({selectedItems.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedItems.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <span className="font-medium text-gray-800">
                                {index + 1}. {item.name}
                              </span>
                              <div className="flex items-center space-x-2">
                                <label className="text-sm text-gray-600">
                                  Qty:
                                </label>
                                <input
                                  type="number"
                                  value={item.qty}
                                  onChange={(e) => {
                                    const newQty = parseInt(e.target.value);
                                    if (newQty < 1) return;
                                    if (newQty > item.stock) {
                                      toast.error(
                                        `Maximum quantity for this item is ${item.stock}`
                                      );
                                      return;
                                    }
                                    updateItemQty(item.id, newQty);
                                  }}
                                  onBlur={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (!value || value < 1) {
                                      updateItemQty(item.id, 1);
                                    }
                                  }}
                                  min="1"
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Pickup: {item.pickupLocation?.address},{" "}
                              {item.pickupLocation?.city},{" "}
                              {item.pickupLocation?.state}{" "}
                              {item.pickupLocation?.zipcode}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="ml-4 text-red-500 hover:text-red-700 p-1"
                            title="Remove item"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delivery Location Section */}
                {/* <div className="mb-6">
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
                        placeholder="Address"
                        name="deliveryLocation.address"
                        value={values.deliveryLocation.address}
                        onChange={handleChange}
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
                        suggestions={filteredCities}
                        completeMethod={searchCities}
                        onDropdownClick={() => {
                          setFilteredCities(allCities);
                        }}
                        onChange={(e) => {
                          const cityValue = e.value || e.target.value;
                          handleChange({
                            target: {
                              name: "deliveryLocation.city",
                              value: cityValue,
                            },
                          });
                          // setSelectedCity(cityValue);
                          if (cityValue) {
                            const state = getStateByCity(cityValue);
                            // setDetectedState(state);
                            if (state) {
                              handleChange({
                                target: {
                                  name: "deliveryLocation.state",
                                  value: state,
                                },
                              });
                            }
                          }
                        }}
                        dropdown
                        placeholder="Select or type city"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700"
                        className="w-full"
                        panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                        itemTemplate={(item) => (
                          <div className="px-3 py-2 hover:bg-gray-100 text-sm">
                            {item}
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
                        suggestions={filteredStates}
                        completeMethod={searchStates}
                        onDropdownClick={() => {
                          setFilteredStates(allStates);
                        }}
                        onChange={(e) => {
                          const stateValue = e.value || e.target.value;
                          handleChange({
                            target: {
                              name: "deliveryLocation.state",
                              value: stateValue,
                            },
                          });
                          // setSelectedState(stateValue);
                        }}
                        dropdown
                        placeholder="Select or type state"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700"
                        className="w-full"
                        panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                        itemTemplate={(item) => (
                          <div className="px-3 py-2 hover:bg-gray-100 text-sm">
                            {item}
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
                        placeholder="Zipcode"
                        name="deliveryLocation.zipcode"
                        value={values.deliveryLocation.zipcode}
                        onChange={handleChange}
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
                </div> */}

                {/* Submit Button */}
                <div className="flex flex-wrap justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {selectedItems.length > 0 && (
                      <div className="grid items-start">
                        <span>
                          Total Items: {selectedItems.length} | Total Quantity:{" "}
                          {selectedItems.reduce(
                            (sum, item) => sum + item.qty,
                            0
                          )}
                        </span>
                        <span className="mt-1">
                          Delivery Location:{" "}
                          {user?.delivery_Address
                            ? `${user.delivery_Address.address}, ${user.delivery_Address.city}, ${user.delivery_Address.state} ${user.delivery_Address.zipcode}`
                            : "Not provided"}
                          <Link
                            href="/account-info"
                            className="text-secondary hover:underline ml-2"
                          >
                            <span className="text-secondary hover:underline">
                              Update Address
                            </span>
                          </Link>
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={selectedItems.length === 0}
                    className={`font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors cursor-pointer ${
                      selectedItems.length === 0
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-secondary hover:bg-secondary text-white focus:ring-secondary"
                    }`}
                  >
                    Submit Order{" "}
                    {selectedItems.length > 0 &&
                      `(${selectedItems.length} items)`}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </Layout>
  );
}
