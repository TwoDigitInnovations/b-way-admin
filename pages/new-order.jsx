import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import Layout from "@/components/layout";
import itemsData from "../utils/items.json";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoutes } from "@/store/routeSlice";
import { fetchDrivers } from "@/store/driverSlice";
import { Api } from "@/helper/service";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function NewOrder({ loader }) {
  const [items, setItems] = useState(itemsData);
  const dispatch = useDispatch();
  const router = useRouter();
  const { routes, assignedRoute, loading } = useSelector(
    (state) => state.route
  );
  const { drivers, assignedDriver } = useSelector((state) => state.driver);

  console.log("Routes:", routes);
  console.log("Drivers:", drivers);

  useEffect(() => {
    dispatch(fetchRoutes());
    dispatch(fetchDrivers());
  }, [dispatch]);

  const validationSchema = Yup.object({
    items: Yup.string().required("Item(s) is required"),
    qty: Yup.number()
      .required("Quantity is required")
      .min(1, "Must be at least 1"),
    pickupLocation: Yup.string().required("Pickup address is required"),
    pickupCity: Yup.string().required("Pickup city is required"),
    pickupState: Yup.string().required("Pickup state is required"),
    pickupZipcode: Yup.string().required("Pickup zipcode is required"),
    deliveryLocation: Yup.string().required("Delivery address is required"),
    deliveryCity: Yup.string().required("Delivery city is required"),
    deliveryState: Yup.string().required("Delivery state is required"),
    deliveryZipcode: Yup.string().required("Delivery zipcode is required"),
    assignedDriver: Yup.string().required("Assigned driver is required"),
    route: Yup.string().required("Route is required"),
    eta: Yup.string().required("ETA is required"),
  });

  const initialValues = {
    items: "",
    qty: "",
    pickupLocation: "",
    pickupCity: "",
    pickupState: "",
    pickupZipcode: "",
    deliveryLocation: "",
    deliveryCity: "",
    deliveryState: "",
    deliveryZipcode: "",
    assignedDriver: "",
    route: "",
    eta: "",
  };

  const handleSubmit = (values) => {
    console.log("Form submitted with values:", values);
    loader(true);
    Api(
      "POST",
      "/order/create",
      {
        ...values,
      },
      router
    )
      .then((response) => {
        console.log("Order created successfully:", response);
        if (response?.status) {
          toast.success("Order created successfully!");

          //   router.push("/ordersv");
          // clear form values
          values.items = "";
          values.qty = "";
          values.pickupLocation = "";
          values.pickupCity = "";
          values.pickupState = "";
          values.pickupZipcode = "";
          values.deliveryLocation = "";
          values.deliveryCity = "";
          values.deliveryState = "";
          values.deliveryZipcode = "";
          values.assignedDriver = "";
          values.route = "";
          values.eta = "";
        } else {
          toast.error("Failed to create order. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      })
      .finally(() => {
        loader(false);
      });
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
                    <select
                      name="items"
                      value={values.items}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                    >
                      <option value="">Select Item(S)</option>
                      {items?.items?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Route
                    </label>
                    <select
                      name="route"
                      value={values.route}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                    >
                      <option value="">Select Route</option>
                      {routes.map((route) => (
                        <option key={route._id} value={route._id}>
                          {route.routeName}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-red-600">
                      {errors.route && touched.route && errors.route}
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
                        name="pickupLocation"
                        value={values.pickupLocation}
                        onChange={handleChange}
                        placeholder="Address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                      />
                      <span className="text-sm text-red-600">
                        {errors.pickupLocation &&
                          touched.pickupLocation &&
                          errors.pickupLocation}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <select
                        name="pickupCity"
                        value={values.pickupCity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                      >
                        <option value="">Select City</option>
                        <option value="New York">New York</option>
                      </select>
                      <span className="text-sm text-red-600">
                        {errors.pickupCity &&
                          touched.pickupCity &&
                          errors.pickupCity}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <select
                        name="pickupState"
                        value={values.pickupState}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                      >
                        <option value="">Select State</option>
                        <option value="NY">NY</option>
                      </select>
                      <span className="text-sm text-red-600">
                        {errors.pickupState &&
                          touched.pickupState &&
                          errors.pickupState}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zipcode
                      </label>
                      <input
                        type="text"
                        placeholder="Zipcode"
                        name="pickupZipcode"
                        value={values.pickupZipcode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                      />
                      <span className="text-sm text-red-600">
                        {errors.pickupZipcode &&
                          touched.pickupZipcode &&
                          errors.pickupZipcode}
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
                        placeholder="Address"
                        name="deliveryLocation"
                        value={values.deliveryLocation}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                      />
                      <span className="text-sm text-red-600">
                        {errors.deliveryLocation &&
                          touched.deliveryLocation &&
                          errors.deliveryLocation}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <select
                        name="deliveryCity"
                        value={values.deliveryCity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                      >
                        <option value="">Select City</option>
                        <option value="New York">New York</option>
                      </select>
                      <span className="text-sm text-red-600">
                        {errors.deliveryCity &&
                          touched.deliveryCity &&
                          errors.deliveryCity}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <select
                        name="deliveryState"
                        value={values.deliveryState}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                      >
                        <option value="">Select State</option>
                        <option value="NY">NY</option>
                      </select>

                      <span className="text-sm text-red-600">
                        {errors.deliveryState &&
                          touched.deliveryState &&
                          errors.deliveryState}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zipcode
                      </label>
                      <input
                        type="text"
                        placeholder="Zipcode"
                        name="deliveryZipcode"
                        value={values.deliveryZipcode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                      />
                      <span className="text-sm text-red-600">
                        {errors.deliveryZipcode &&
                          touched.deliveryZipcode &&
                          errors.deliveryZipcode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row - Assigned Driver, ETA, Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned Driver
                    </label>
                    <select
                      name="assignedDriver"
                      value={values.assignedDriver}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                    >
                      <option value="">Select Assigned Driver</option>
                      {drivers.map((driver) => (
                        <option key={driver._id} value={driver.driver._id}>
                          {driver.driver.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-red-600">
                      {errors.assignedDriver &&
                        touched.assignedDriver &&
                        errors.assignedDriver}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ETA
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="2:10 PM"
                        name="eta"
                        value={values.eta}
                        onChange={handleChange}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                      />
                      <Clock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                    <span className="text-sm text-red-600">
                      {errors.eta && touched.eta && errors.eta}
                    </span>
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700">
                      <option>Select Status</option>
                      <option>Cancelled</option>
                      <option>Delivered</option>
                      <option>Picked Up</option>
                      <option>Scheduled</option>
                      <option>Return Created</option>
                      <option>Invoice Generated</option>
                    </select>
                  </div> */}
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
