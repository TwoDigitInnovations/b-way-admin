import Layout from "@/components/layout";
import { InputSwitch } from "primereact/inputswitch";
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Api } from "@/helper/service";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import isAuth from "@/components/isAuth";

function AccountInfo({ loader }) {
  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Old password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const router = useRouter();

  const handleSubmit = (values, { setSubmitting }) => {
    const { oldPassword, newPassword, confirmPassword } = values;
    loader(true);

    Api(
      "PUT",
      "/auth/change-password",
      {
        oldPassword,
        newPassword,
        confirmPassword,
      },
      router
    )
      .then((res) => {
        if (res?.status) {
          toast.success("Password changed successfully!");
          router.push("/dashboardv");
        }
      })
      .catch((err) => {
        toast.error(
          err?.message || "Failed to change password. Please try again."
        );
      })
      .finally(() => {
        setSubmitting(false);
        loader(false);
      });
  };

  return (
    <Layout title="Account Information">
      {/* Main Panel */}
      <div className="bg-white shadow-sm border border-gray-200 p-4 mb-4 lg:mb-6 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 pb-4 mb-4 border-b border-gray-200">
          Account Information
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
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
                    value={values.oldPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.oldPassword && touched.oldPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.oldPassword}
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
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.newPassword && touched.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.newPassword}
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
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
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
                    placeholder="Enter Email"
                    name="email"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
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
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.address && touched.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.oldPassword}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-800 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                    placeholder="Enter City"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.city && touched.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-800 mb-2">
                    State
                  </label>
                  <select
                    className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select State</option>
                    <option value="California">California</option>
                    <option value="Texas">Texas</option>
                    <option value="New York">New York</option>
                    <option value="Florida">Florida</option>
                    <option value="Illinois">Illinois</option>
                  </select>
                  {errors.state && touched.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>
                 <div>
                  <label className="block text-xs text-gray-800 mb-2">
                    Zipcode
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                    placeholder="Enter Zipcode"
                    name="zipcode"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.state && touched.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                // disabled={isSubmitting}
                className="bg-secondary hover:bg-secondary text-white font-semibold px-6 py-2 rounded cursor-pointer"
              >
                {isSubmitting ? "Please Wait..." : "Submit"}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </Layout>
  );
}

export default AccountInfo;
