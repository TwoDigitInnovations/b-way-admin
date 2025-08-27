import React, { useContext, useState } from "react";
import { Search, Bell, ChevronDown, Menu, X, Lock, User } from "lucide-react";
import { useRouter } from "next/router";
import { LogOut } from "lucide-react";
import Sidebar from "./sidebar";
import { userContext } from "@/pages/_app";
import LiveClock from "./LiveClock";
import BasicModal from "./modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Popover } from "@mui/material";
import { Api } from "@/helper/service";
import toast from "react-hot-toast";

export default function Layout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string().required("Role is required"),
  });

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log("Form submitted:", values);
      const response = await Api("post", "/auth/send-invitation", values);
      console.log("Invitation sent:", response);
      toast.success("Invitation sent successfully!");
      resetForm();
      setModalOpen(false);
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile hamburger menu */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                {title || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <LiveClock />

              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-48 lg:w-64"
                />
              </div>

              {/* Mobile search icon */}
              <button className="sm:hidden p-2 text-gray-400 hover:text-gray-600">
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button
                aria-describedby={id}
                onClick={handleClick}
                className="relative p-2 text-gray-400 hover:text-gray-600"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="relative">
                <div
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 relative"
                >
                  <span className="text-sm text-gray-700 hidden md:block cursor-pointer">
                    {user?.name || "System Admin"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <ul className="py-1">
                      <li
                        onClick={() => {
                          setModalOpen(true);
                        }}
                        className="px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer text-sm
                      transition-colors"
                      >
                        <User className="inline-block mr-2 w-4 h-4" />
                        Add User
                      </li>
                      <li
                        onClick={() => {
                          router.push("/change-password");
                        }}
                        className="px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer text-sm
                      transition-colors"
                      >
                        <Lock className="inline-block mr-2 w-4 h-4" />
                        Change Password
                      </li>
                      <li
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("userDetail");
                          router.push("/");
                        }}
                        className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer text-sm
                      transition-colors"
                      >
                        <LogOut className="inline-block mr-2 w-4 h-4" />
                        Log Out
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <div className="flex flex-col gap-3 rounded-sm">
            {[1, 2, 3, 4].map((item, index) => (
              <div key={index} className="relative border-b border-gray-200">
                {/* <button
                  onclick="return this.parentNode.remove()"
                  className="absolute p-1 bg-gray-100 border border-gray-300 rounded-full -top-1 -right-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button> */}
                <div className="flex items-center p-4">
                  {/* <img
                    className="object-cover w-12 h-12 rounded-lg"
                    src="https://randomuser.me/api/portraits/women/71.jpg"
                    alt=""
                  /> */}
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-900">New Order Placed</p>
                    <p className="max-w-xs text-xs text-gray-500 truncate">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Eveniet, laborum?
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Popover>
        <BasicModal open={modalOpen} setOpen={setModalOpen}>
          <div className="min-w-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#003C72]">
                Invite User To B-Way
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <Formik
              initialValues={{
                name: "",
                email: "",
                role: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
              enableReinitialize={true}
            >
              {({ isSubmitting, touched, errors, setFieldValue, values }) => (
                <Form className="pt-6 space-y-6">
                  {/* Route Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Name *
                    </label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter user name"
                      className={`w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        touched.name && errors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>{" "}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Email *
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter user email"
                      className={`w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        touched.email && errors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <Field
                      as="select"
                      name="role"
                      className={`w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 ${
                        touched.role && errors.role
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Role</option>
                      <option value="CLIENT">Client</option>
                      <option value="CLINIC">Clinic</option>
                      <option value="HOSPITAL">Hospital</option>
                    </Field>
                    <ErrorMessage
                      name="role"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  {/* Submit Button */}
                  <div className="flex justify-end pt-6 gap-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
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
                      {isSubmitting ? "Submitting..." : "Send Invite"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </BasicModal>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
