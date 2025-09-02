import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { Calendar } from "primereact/calendar";
import Link from "next/link";
import { fetchHospital } from "@/store/hospitalSlice";

export default function NewOrder({ loader, user }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [currentItemInput, setCurrentItemInput] = useState("");
  const [currentQty, setCurrentQty] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { items } = useSelector((state) => state.item);
  const { hospitals } = useSelector((state) => state.hospital);
  const statesAndCities = getStateAndCityPicklist();
  const allCities = Object.values(statesAndCities).flat();
  const allStates = Object.keys(statesAndCities);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [selectedCurrentItem, setSelectedCurrentItem] = useState(null);
  const [maxQty, setMaxQty] = useState(0);
  const [deliveryType, setDeliveryType] = useState("Stat");
  const [temperatureRequirements, setTemperatureRequirements] =
    useState("Controlled");
  const [dateTime, setDateTime] = useState(null);
  const [complianceAlert, setComplianceAlert] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(fetchItems());
    dispatch(fetchHospital());
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

    // Validate scheduled delivery has a date
    if (deliveryType === "Scheduled" && !dateTime) {
      toast.error("Please select a date and time for scheduled delivery");
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
      deliveryUrgency: deliveryType,
      scheduledDateTime: deliveryType === "Scheduled" ? dateTime : null,
      temperatureRequirements: temperatureRequirements,
      hipaaFdaCompliance: complianceAlert ? "Yes" : "No",
      description: description.trim() || "No description provided",
    };

    setSelectedItems([...selectedItems, newItem]);
    setCurrentItemInput("");
    setCurrentQty("");
    setSelectedCurrentItem(null);
    setFilteredItems(items);
    setMaxQty(0);
    
    // Reset form fields for next item
    setDeliveryType("Stat");
    setDateTime(null);
    setTemperatureRequirements("Controlled");
    setComplianceAlert(false);
    setDescription("");
    
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

    // Validate hospital selection for CLIENT users
    if (user?.role === 'CLIENT' && !selectedHospital?._id) {
      toast.error("Please select a hospital for delivery");
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
        deliveryUrgency: item.deliveryUrgency,
        scheduledDateTime: item.scheduledDateTime,
        temperatureRequirements: item.temperatureRequirements,
        hipaaFdaCompliance: item.hipaaFdaCompliance,
        description: item.description,
      })),
      // Only send hospitalId when user is a CLIENT
      ...(user?.role === 'CLIENT' && selectedHospital?._id && { hospitalId: selectedHospital._id }),
    };

    Api("POST", "/order/create", orderData, router)
      .then((response) => {
        console.log("Order created successfully:", response);
        if (response?.status) {
          toast.success("Order created successfully!");
          resetForm();
          setSelectedItems([]);
          setSelectedHospital(null);
          setCurrentItemInput("");
          setCurrentQty("");
          setSelectedCurrentItem(null);
          setDeliveryType("Stat");
          setDateTime(null);
          setTemperatureRequirements("Controlled");
          setComplianceAlert(false);
          setDescription("");
          //   router.push("/orders");
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

  const searchHospitals = (event) => {
    const query = event.query.toLowerCase();
    const _filteredHospitals = hospitals.filter((hospital) =>
      hospital.name.toLowerCase().includes(query)
    );
    setFilteredHospitals(_filteredHospitals);
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
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end`}>
                  {user?.role === 'CLIENT' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Hospital *
                      </label>
                      <AutoComplete
                        value={selectedHospital}
                        suggestions={filteredHospitals}
                        completeMethod={searchHospitals}
                        field="name"
                        onChange={(e) => {
                          setSelectedHospital(e.value);
                        }}
                        onSelect={(e) => {
                          const selectedItem = e.value;
                          setSelectedHospital(selectedItem); // Set the entire hospital object, not just the name
                        }}
                        dropdown
                        placeholder="Select or type hospital"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700"
                        className="w-full"
                        panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Item(S)
                    </label>
                    {/* <Dropdown data={items} value={currentItemInput} selected={handleItemSelect} changed={handleItemChange} /> */}
                    <AutoComplete
                      value={currentItemInput}
                      suggestions={filteredItems}
                      completeMethod={searchItems}
                      field="name"
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
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
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
                </div>

                <section className="mb-6">
                  <div className="grid md:grid-cols-6 gap-4 mb-3">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Delivery Urgency
                      </label>
                      <div className="flex flex-wrap gap-2 w-full items-center">
                        <button
                          type="button"
                          className={`px-4 py-1 h-10 min-w-32 rounded border text-sm ${
                            deliveryType === "Stat"
                              ? "bg-secondary text-white border-secondary"
                              : "bg-gray-200 text-gray-800 border-gray-300"
                          }`}
                          onClick={() => {
                            setDeliveryType("Stat");
                            setDateTime(null);
                          }}
                        >
                          STAT
                        </button>
                        <button
                          type="button"
                          className={`px-4 py-1 h-10 min-w-32 rounded border text-sm ${
                            deliveryType === "Same-Day"
                              ? "bg-secondary text-white border-secondary"
                              : "bg-gray-200 text-gray-800 border-gray-300"
                          }`}
                          onClick={() => {
                            setDeliveryType("Same-Day");
                            setDateTime(null);
                          }}
                        >
                          Same-Day
                        </button>
                        <div
                          className="flex-auto relative"
                          onClick={() => setDeliveryType("Scheduled")}
                        >
                          <button
                            type="button"
                            className={`px-4 py-1 h-10 min-w-32 rounded border text-sm ${
                              deliveryType === "Scheduled"
                                ? "bg-secondary text-white border-secondary"
                                : "bg-gray-200 text-gray-800 border-gray-300"
                            }`}
                          >
                            Scheduled
                          </button>
                          <Calendar
                            className="!opacity-0 !h-10 !w-32 !absolute !left-0"
                            id="calendar-12h"
                            value={dateTime}
                            onChange={(e) => {
                              setDateTime(e.value);
                              setDeliveryType("Scheduled");
                            }}
                            showTime
                            hourFormat="12"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Temperature Requirements
                      </label>
                      <div className="flex flex-wrap gap-2 w-full items-center">
                        <button
                          type="button"
                          className={`px-4 py-1 h-10 min-w-32 rounded border text-sm ${
                            temperatureRequirements === "Controlled"
                              ? "bg-secondary text-white border-secondary"
                              : "bg-gray-200 text-gray-800 border-gray-300"
                          }`}
                          onClick={() =>
                            setTemperatureRequirements("Controlled")
                          }
                        >
                          Controlled
                        </button>
                        <button
                          type="button"
                          className={`px-4 py-1 h-10 min-w-32 rounded border text-sm ${
                            temperatureRequirements === "Room Temperature"
                              ? "bg-secondary text-white border-secondary"
                              : "bg-gray-200 text-gray-800 border-gray-300"
                          }`}
                          onClick={() =>
                            setTemperatureRequirements("Room Temperature")
                          }
                        >
                          Room Temperature
                        </button>
                      </div>
                    </div>
                  </div>
                  {dateTime && (
                    <span className="text-primary text-sm">
                      Your Delivery Date is:{" "}
                      {dateTime?.toLocaleString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  )}
                  {deliveryType === "Same-Day" && (
                    <>
                      {/* <span className="text-primary text-sm">
                        Nearest Driver <strong>John Doe</strong>
                      </span>{" "}
                      <br />
                      <span className="text-primary text-sm">
                        Estimated Arrival: <strong>30 mins</strong>
                      </span> */}
                    </>
                  )}
                    <div className="my-4">
                      <span className="block text-sm font-semibold text-gray-800 mb-2">
                       Compliance Alert
                      </span>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={complianceAlert}
                          onChange={(e) => setComplianceAlert(e.target.checked)}
                        />
                        <span className="text-sm text-gray-600">
                          HIPAA / FDA Compliance
                        </span>
                      </div>
                    </div>
                  <div className="grid md:grid-cols-6 gap-4 mt-2 items-center">
                    <div className="col-span-4">
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Description
                      </label>
                      <textarea
                        className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200"
                        rows={3}
                        placeholder="Description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={addItem}
                        className="bg-primary hover:bg-primary text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors cursor-pointer h-10"
                      >
                        <PlusIcon className="h-5 w-5 inline-block mr-2" />
                        Add More Item
                      </button>
                    </div>
                  </div>
                </section>

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
                            <div className="text-sm flex text-gray-600 mt-1 items-center">
                              <span className="font-medium">Delivery Urgency:</span>{" "}
                              <span className="ml-1">
                                {item.deliveryUrgency}
                                {item.deliveryUrgency === "Scheduled" && item.scheduledDateTime && (
                                  <span className="text-primary ml-2">
                                    ({new Date(item.scheduledDateTime).toLocaleString("en-US", {
                                      month: "numeric",
                                      day: "numeric", 
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    })})
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="text-sm flex text-gray-600 mt-1 items-center">
                              <span className="font-medium">Temperature Requirements:</span>{" "}
                              <span className="ml-1">
                                {item.temperatureRequirements}
                              </span>
                            </div>
                            <div className="text-sm flex text-gray-600 mt-1 items-center">
                              <span className="font-medium">HIPAA / FDA Compliance:</span>{" "}
                              <span className="ml-1">
                                {item.hipaaFdaCompliance}
                              </span>
                            </div>
                            <div className="text-sm flex text-gray-600 mt-1 items-center">
                              <span className="font-medium">Description:</span>{" "}
                              <span className="ml-1">
                                {item.description}
                              </span>
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
                          {user?.role === 'CLIENT' ? (
                            // For CLIENT users, show selected hospital's delivery address
                            selectedHospital?.delivery_Address ? (
                              `${selectedHospital.delivery_Address.address}, ${selectedHospital.delivery_Address.city}, ${selectedHospital.delivery_Address.state} ${selectedHospital.delivery_Address.zipcode}`
                            ) : selectedHospital ? (
                              "Hospital delivery address not provided"
                            ) : (
                              "Please select a hospital first"
                            )
                          ) : (
                            // For HOSPITAL users, show their own delivery address
                            user?.delivery_Address ? (
                              `${user.delivery_Address.address}, ${user.delivery_Address.city}, ${user.delivery_Address.state} ${user.delivery_Address.zipcode}`
                            ) : (
                              "Not provided"
                            )
                          )}
                          {user?.role !== 'CLIENT' && (
                            <Link
                              href="/account-info"
                              className="text-secondary hover:underline ml-2"
                            >
                              <span className="text-secondary hover:underline">
                                Update Address
                              </span>
                            </Link>
                          )}
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
