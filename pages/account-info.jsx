import Layout from "@/components/layout";
import { InputSwitch } from "primereact/inputswitch";
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Api } from "@/helper/service";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import isAuth from "@/components/isAuth";
import { getStateAndCityPicklist, getStateByCity } from "@/utils/states";
import { AutoComplete } from "primereact/autocomplete";

function AccountInfo({ loader, user }) {
  const [userDetails, setUserDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const statesAndCities = getStateAndCityPicklist();
  const allStates = Object.keys(statesAndCities);
  const allCities = Object.values(statesAndCities).flat();
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [sameAddress, setSameAddress] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    primaryPerson: Yup.string()
      .required("Primary contact person is required")
      .min(2, "Primary contact person must be at least 2 characters"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number must be 10 digits"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    billing_Address: Yup.object({
      address: Yup.string()
        .required("Address is required")
        .min(5, "Address must be at least 5 characters"),
      city: Yup.string()
        .required("City is required")
        .min(2, "City must be at least 2 characters"),
      state: Yup.string().required("State is required"),
      zipcode: Yup.string()
        .matches(/^\d{5}$/, "Zipcode must be 5 digits")
        .required("Zipcode is required"),
    }),
    delivery_Address: Yup.object({
      address: Yup.string()
        .required("Address is required")
        .min(5, "Address must be at least 5 characters"),
      city: Yup.string()
        .required("City is required")
        .min(2, "City must be at least 2 characters"),
      state: Yup.string().required("State is required"),
      zipcode: Yup.string()
        .matches(/^\d{5}$/, "Zipcode must be 5 digits")
        .required("Zipcode is required"),
    }),
  });

  const router = useRouter();

  const fetchUserDetails = () => {
    setLoading(true);
    loader(true);
    Api("GET", "/auth/user-details")
      .then((res) => {
        console.log(res.data.user);
        if (res?.status) {
          setUserDetails(res.data.user);
        }
      })
      .catch((err) => {
        toast.error(
          err?.message || "Failed to fetch user details. Please try again."
        );
      })
      .finally(() => {
        setLoading(false);
        loader(false);
      });
  };

  React.useEffect(() => {
    fetchUserDetails();
    setFilteredCities(allCities);
    setFilteredStates(allStates);
  }, []);

  // Effect to initialize the sameAddress state based on existing data
  React.useEffect(() => {
    if (userDetails?.billing_Address && userDetails?.delivery_Address) {
      const isSame =
        userDetails.billing_Address.address ===
          userDetails.delivery_Address.address &&
        userDetails.billing_Address.city ===
          userDetails.delivery_Address.city &&
        userDetails.billing_Address.state ===
          userDetails.delivery_Address.state &&
        userDetails.billing_Address.zipcode ===
          userDetails.delivery_Address.zipcode;
      setSameAddress(isSame);
    }
  }, [userDetails]);

  const initialValues = {
    name: userDetails?.name || "",
    primaryPerson: userDetails?.primaryContact || "",
    phone: userDetails?.phone || "",
    email: userDetails?.email || "",
    billing_Address: {
      address: userDetails?.billing_Address?.address || "",
      city: userDetails?.billing_Address?.city || "",
      state: userDetails?.billing_Address?.state || "",
      zipcode: userDetails?.billing_Address?.zipcode || "",
    },
    delivery_Address: {
      address: userDetails?.delivery_Address?.address || "",
      city: userDetails?.delivery_Address?.city || "",
      state: userDetails?.delivery_Address?.state || "",
      zipcode: userDetails?.delivery_Address?.zipcode || "",
    },
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const {
      name,
      primaryPerson,
      phone,
      email,
      billing_Address,
      delivery_Address,
    } = values;
    loader(true);

    Api(
      "PUT",
      "/auth/update-profile",
      {
        name,
        primaryContact: primaryPerson,
        phone,
        email,
        billing_Address,
        delivery_Address,
      },
      router
    )
      .then((res) => {
        if (res?.status) {
          toast.success("Profile updated successfully!");
        }
      })
      .catch((err) => {
        toast.error(
          err?.message || "Failed to update profile. Please try again."
        );
      })
      .finally(() => {
        setSubmitting(false);
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

  return (
    <Layout title="Account Information">
      <div className="bg-white shadow-sm border border-gray-200 p-4 mb-4 lg:mb-6 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 pb-4 mb-4 border-b border-gray-200">
          Account Information
        </h2>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">
              Loading account information...
            </span>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => {
              const copyBillingToDelivery = () => {
                setFieldValue(
                  "delivery_Address.address",
                  values.billing_Address.address
                );
                setFieldValue(
                  "delivery_Address.city",
                  values.billing_Address.city
                );
                setFieldValue(
                  "delivery_Address.state",
                  values.billing_Address.state
                );
                setFieldValue(
                  "delivery_Address.zipcode",
                  values.billing_Address.zipcode
                );
              };

              const clearDeliveryAddress = () => {
                setFieldValue("delivery_Address.address", "");
                setFieldValue("delivery_Address.city", "");
                setFieldValue("delivery_Address.state", "");
                setFieldValue("delivery_Address.zipcode", "");
              };

              return (
                <form onSubmit={handleSubmit}>
                  {/* Name, Email, Phone */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div>
                      <label className="block text-xs text-gray-800 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                        placeholder="Enter Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.name && touched.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-800 mb-2">
                        Primary Contact Person
                      </label>
                      <input
                        type="text"
                        className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                        placeholder="Primary Contact Person"
                        name="primaryPerson"
                        value={values.primaryPerson}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.primaryPerson && touched.primaryPerson && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.primaryPerson}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-800 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                        placeholder="Phone"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.phone && touched.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-800 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                        placeholder="Enter your email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.email && touched.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <h2 className="text-sm font-semibold text-blue-900 mb-4">
                    Billing Address (For Invoice Generation)
                  </h2>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div>
                      <label className="block text-xs text-gray-800 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                        placeholder="Enter Address"
                        name="billing_Address.address"
                        value={values.billing_Address.address}
                        onChange={(e) => {
                          handleChange(e);
                          // Auto-sync delivery address if same address is checked
                          if (sameAddress) {
                            setFieldValue(
                              "delivery_Address.address",
                              e.target.value
                            );
                          }
                        }}
                        onBlur={handleBlur}
                      />
                      {errors.billing_Address?.address &&
                        touched.billing_Address?.address && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.billing_Address?.address}
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-800 mb-2">
                        City
                      </label>
                      <AutoComplete
                        value={values.billing_Address.city}
                        suggestions={filteredCities}
                        completeMethod={searchCities}
                        onDropdownClick={() => {
                          setFilteredCities(allCities);
                        }}
                        onChange={(e) => {
                          const cityValue = e.value || e.target.value;
                          handleChange({
                            target: {
                              name: "billing_Address.city",
                              value: cityValue,
                            },
                          });

                          if (cityValue) {
                            const state = getStateByCity(cityValue);
                            if (state) {
                              handleChange({
                                target: {
                                  name: "billing_Address.state",
                                  value: state,
                                },
                              });

                              // Auto-sync delivery address if same address is checked
                              if (sameAddress) {
                                setFieldValue("delivery_Address.state", state);
                              }
                            }
                          }

                          // Auto-sync delivery address if same address is checked
                          if (sameAddress) {
                            setFieldValue("delivery_Address.city", cityValue);
                          }
                        }}
                        dropdown
                        placeholder="Select or type city"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700"
                        className="w-full"
                        panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                        itemTemplate={(item) => (
                          <div className="px-3 py-2 hover:bg-gray-100 !text-sm">
                            {item}
                          </div>
                        )}
                      />
                      {errors.billing_Address?.city &&
                        touched.billing_Address?.city && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.billing_Address?.city}
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-800 mb-2">
                        State
                      </label>
                      {/* <select
                        className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                        name="billing_Address.state"
                        value={values.billing_Address.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="">Select State</option>
                        {allStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select> */}
                      <AutoComplete
                        value={values.billing_Address.state}
                        suggestions={filteredStates}
                        completeMethod={searchStates}
                        onDropdownClick={() => {
                          setFilteredStates(allStates);
                        }}
                        onChange={(e) => {
                          const stateValue = e.value || e.target.value;
                          handleChange({
                            target: {
                              name: "billing_Address.state",
                              value: stateValue,
                            },
                          });

                          // Auto-sync delivery address if same address is checked
                          if (sameAddress) {
                            setFieldValue("delivery_Address.state", stateValue);
                          }
                        }}
                        dropdown
                        placeholder="Select or type state"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700"
                        className="w-full"
                        panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                        itemTemplate={(item) => (
                          <div className="px-3 py-2 hover:bg-gray-100 !text-sm">
                            {item}
                          </div>
                        )}
                      />
                      {errors.billing_Address?.state &&
                        touched.billing_Address?.state && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.billing_Address?.state}
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-800 mb-2">
                        Zipcode
                      </label>
                      <input
                        type="tel"
                        className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                        placeholder="Enter Zipcode"
                        name="billing_Address.zipcode"
                        maxLength="5"
                        value={values.billing_Address.zipcode}
                        onChange={(e) => {
                          handleChange(e);
                          // Auto-sync delivery address if same address is checked
                          if (sameAddress) {
                            setFieldValue(
                              "delivery_Address.zipcode",
                              e.target.value
                            );
                          }
                        }}
                        onBlur={handleBlur}
                      />
                      {errors.billing_Address?.zipcode &&
                        touched.billing_Address?.zipcode && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.billing_Address?.zipcode}
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={sameAddress}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setSameAddress(isChecked);

                        if (isChecked) {
                          copyBillingToDelivery();
                        } else {
                          clearDeliveryAddress();
                        }
                      }}
                    />
                    <label className="text-sm text-gray-700">
                      Delivery address is same as billing address
                    </label>
                  </div>

                  <h2 className="text-sm font-semibold text-blue-900 mb-4">
                    Delivery Location (For Order Delivery)
                  </h2>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div>
                      <label className="block text-xs text-gray-800 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        className={`w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10 ${
                          sameAddress ? "bg-gray-100" : ""
                        }`}
                        placeholder="Enter Address"
                        name="delivery_Address.address"
                        value={values.delivery_Address.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={sameAddress}
                      />
                      {errors.delivery_Address?.address &&
                        touched.delivery_Address?.address && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.delivery_Address?.address}
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-800 mb-2">
                        City
                      </label>
                      {/* <input
                        type="text"
                        className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                        placeholder="Enter City"
                        name="delivery_Address.city"
                        value={values.delivery_Address.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      /> */}
                      <AutoComplete
                        value={values.delivery_Address.city}
                        suggestions={filteredCities}
                        completeMethod={searchCities}
                        onDropdownClick={() => {
                          setFilteredCities(allCities);
                        }}
                        onChange={(e) => {
                          const cityValue = e.value || e.target.value;
                          handleChange({
                            target: {
                              name: "delivery_Address.city",
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
                                  name: "delivery_Address.state",
                                  value: state,
                                },
                              });
                            }
                          }
                        }}
                        dropdown
                        placeholder="Select or type city"
                        inputClassName={`w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700 ${
                          sameAddress ? "bg-gray-100" : ""
                        }`}
                        className="w-full"
                        panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                        itemTemplate={(item) => (
                          <div className="px-3 py-2 hover:bg-gray-100 !text-sm">
                            {item}
                          </div>
                        )}
                        disabled={sameAddress}
                      />
                      {errors.delivery_Address?.city &&
                        touched.delivery_Address?.city && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.delivery_Address?.city}
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-800 mb-2">
                        State
                      </label>
                      {/* <select
                        className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                        name="delivery_Address.state"
                        value={values.delivery_Address.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="">Select State</option>
                        {allStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select> */}
                      <AutoComplete
                        value={values.delivery_Address.state}
                        suggestions={filteredStates}
                        completeMethod={searchStates}
                        onDropdownClick={() => {
                          setFilteredStates(allStates);
                        }}
                        onChange={(e) => {
                          const stateValue = e.value || e.target.value;
                          handleChange({
                            target: {
                              name: "delivery_Address.state",
                              value: stateValue,
                            },
                          });
                          // setSelectedState(stateValue);
                        }}
                        dropdown
                        placeholder="Select or type state"
                        inputClassName={`w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700 ${
                          sameAddress ? "bg-gray-100" : ""
                        }`}
                        className="w-full"
                        panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
                        itemTemplate={(item) => (
                          <div className="px-3 py-2 hover:bg-gray-100 !text-sm">
                            {item}
                          </div>
                        )}
                        disabled={sameAddress}
                      />
                      {errors.delivery_Address?.state &&
                        touched.delivery_Address?.state && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.delivery_Address?.state}
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-800 mb-2">
                        Zipcode
                      </label>
                      <input
                        type="text"
                        className={`w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10 ${
                          sameAddress ? "bg-gray-100" : ""
                        }`}
                        placeholder="Enter Zipcode"
                        name="delivery_Address.zipcode"
                        value={values.delivery_Address.zipcode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={sameAddress}
                        maxLength="5"
                      />
                      {errors.delivery_Address?.zipcode &&
                        touched.delivery_Address?.zipcode && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.delivery_Address?.zipcode}
                          </p>
                        )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-secondary hover:bg-secondary text-white font-semibold px-6 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Please Wait..." : "Submit"}
                  </button>
                </form>
              );
            }}
          </Formik>
        )}
      </div>
    </Layout>
  );
}

export default isAuth(AccountInfo);
