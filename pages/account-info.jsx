import Layout from "@/components/layout";
import { InputSwitch } from "primereact/inputswitch";
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Api } from "@/helper/service";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import isAuth from "@/components/isAuth";

function AccountInfo({ loader, user }) {
  const [userDetails, setUserDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

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
  });

  const router = useRouter();

  const fetchUserDetails = () => {
    setLoading(true);
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
      });
  };

  React.useEffect(() => {
    fetchUserDetails();
  }, []);

  const initialValues = {
    name: userDetails?.name || "",
    primaryPerson: userDetails?.primaryContact || "",
    phone: userDetails?.phone || "",
    email: userDetails?.email || "",
    address: userDetails?.address || "",
    city: userDetails?.city || "",
    state: userDetails?.state || "",
    zipcode: userDetails?.zipcode || "",
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const { name, primaryPerson, phone, email, address, city, state, zipcode } =
      values;
    loader(true);

    Api(
      "PUT",
      "/auth/update-profile",
      {
        name,
        primaryContact: primaryPerson,
        phone,
        email,
        address,
        city,
        state,
        zipcode,
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

  return (
    <Layout title="Account Information">
      {/* Main Panel */}
      <div className="bg-white shadow-sm border border-gray-200 p-4 mb-4 lg:mb-6 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 pb-4 mb-4 border-b border-gray-200">
          Account Information
        </h2>
        {loading ? (
          loader(true)
        ) : (
          <>
            {loader(false)}
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
                        placeholder="Enter Email"
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
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.address && touched.address && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.address}
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
                        <p className="mt-1 text-sm text-red-600">
                          {errors.city}
                        </p>
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
                        <p className="mt-1 text-sm text-red-600">
                          {errors.state}
                        </p>
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
                        value={values.zipcode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.zipcode && touched.zipcode && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.zipcode}
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
              )}
            </Formik>
          </>
        )}
      </div>
    </Layout>
  );
}

export default isAuth(AccountInfo);
