import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
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

export default function NewOrder({ loader }) {
  const [selectedItemLocation, setSelectedItemLocation] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const { items } = useSelector((state) => state.item);
  const statesAndCities = getStateAndCityPicklist();
  const allCities = Object.values(statesAndCities).flat();
  const allStates = Object.keys(statesAndCities);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [detectedState, setDetectedState] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [itemInput, setItemInput] = useState("");

  useEffect(() => {
    dispatch(fetchItems());
    // Initialize filtered cities and states with all options
    setFilteredCities(allCities);
    setFilteredStates(allStates);
  }, [dispatch]);

  const validationSchema = Yup.object({
    items: Yup.string().required("Item(s) is required"),
    qty: Yup.number()
      .required("Quantity is required")
      .min(1, "Must be at least 1"),
    // pickupLocation: Yup.object({
    //   address: Yup.string().required("Pickup address is required"),
    //   city: Yup.string().required("Pickup city is required"),
    //   state: Yup.string().required("Pickup state is required"),
    //   zipcode: Yup.string()
    //   .matches(/^\d{5}$/, "Pickup zipcode must be exactly 5 digits")
    //   .required("Pickup zipcode is required"),
    // }),
    deliveryLocation: Yup.object({
      address: Yup.string().required("Delivery address is required"),
      city: Yup.string().required("Delivery city is required"),
      state: Yup.string().required("Delivery state is required"),
      zipcode: Yup.string()
        .matches(/^\d{5}$/, "Delivery zipcode must be exactly 5 digits")
        .required("Delivery zipcode is required"),
    }),
  });

  const initialValues = {
    items: "",
    qty: "",
    deliveryLocation: {
      address: "",
      city: "",
      state: "",
      zipcode: "",
    },
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log("Form submitted with values:", values);
    loader(true);

    // Transform the data to match backend expectations
    const orderData = {
      items: values.items,
      qty: values.qty,
      pickupLocation: selectedItemLocation.address,
      pickupCity: selectedItemLocation.city,
      pickupState: selectedItemLocation.state,
      pickupZipcode: selectedItemLocation.zipcode,
      deliveryLocation: values.deliveryLocation.address,
      deliveryCity: values.deliveryLocation.city,
      deliveryState: values.deliveryLocation.state,
      deliveryZipcode: values.deliveryLocation.zipcode,
    };

    Api("POST", "/order/create", orderData, router)
      .then((response) => {
        console.log("Order created successfully:", response);
        if (response?.status) {
          toast.success("Order created successfully!");
          resetForm();
          setSelectedItemLocation(null);
          setItemInput(""); // Reset input
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
      filtered = allStates; // Show all states when no query
    } else {
      filtered = allStates.filter((state) =>
        state.toLowerCase().includes(event.query.toLowerCase())
      );
    }
    setFilteredStates(filtered);
  };

  // Autocomplete search for items
  const searchItems = (event) => {
    let filtered = [];
    if (!event.query || event.query.length === 0) {
      filtered = items;
    } else {
      filtered = items.filter((item) =>
        item.name.toLowerCase().includes(event.query.toLowerCase())
      );
    }
    setFilteredItems(filtered);
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item(S)
                    </label>
                    <AutoComplete
                      value={itemInput}
                      suggestions={filteredItems}
                      completeMethod={searchItems}
                      field="name"
                      onChange={(e) => {
                        setItemInput(e.value);
                      }}
                      onSelect={(e) => {
                        const selectedItem = e.value;
                        setItemInput(selectedItem.name);
                        handleChange({
                          target: {
                            name: "items",
                            value: selectedItem?._id || "",
                          },
                        });
                        setSelectedItemLocation(selectedItem ? selectedItem.pickupLocation : null);
                      }}
                      dropdown
                      placeholder="Select or type item"
                      inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700"
                      className="w-full"
                      panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                      itemTemplate={(item) => (
                        <div className="px-3 py-2 hover:bg-gray-100 text-sm">
                          {item.name}
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
                          setSelectedCity(cityValue);
                          if (cityValue) {
                            const state = getStateByCity(cityValue);
                            setDetectedState(state);
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
                          setSelectedState(stateValue);
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
                </div>

                {/* Submit Button */}
                <div className="flex justify-start">
                  <button
                    type="submit"
                    className="bg-secondary hover:bg-secondary text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors cursor-pointer"
                  >
                    Submit
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
