import React, { useContext, useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Api } from "@/helper/service";
import { Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { userContext } from "./_app";
import Cookies from "js-cookie";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Modal } from "@mui/material";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function ErrorCard({ title, message }) {
  return (
    <Modal open={true}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        ></span>
        <div
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3
                className="text-lg leading-6 font-semibold text-gray-900"
                id="modal-headline"
              >
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary sm:text-sm"
              // onClick={() => closeModal()}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function RegisterPage({ loader }) {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const validateToken = async () => {
      loader(true);
      const token = searchParams.get("token");
      if (!token) return;

      try {
        const res = await Api("POST", "/auth/validate-invitation", { token });
        setUser(res.user);
        setInitialValues((prev) => ({
          ...prev,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
        }));
      } catch (error) {
        console.error("Token validation error:", error);
        toast.error("Invalid or expired token");
        setError(true);
      } finally {
        loader(false);
      }
    };

    validateToken();
  }, [searchParams, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const { email, password, name } = values;
    loader(true);

    Api("POST", "/auth/register", { email, password, name, role: user.role }, router)
      .then((res) => {
        if (res?.status) {
          toast.success("Registration successful!");
          router.push("/");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        toast.error(err?.message || "Login failed. Please try again.");
      })
      .finally(() => {
        loader(false);
        setSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen flex">
      {error && (
        <ErrorCard
          title="Token Mismatch"
          message="There was an error processing your registration."
        />
      )}
      {/* Left Side - Login Form */}
      <div className="flex-1 lg:flex-[0.8] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-6">
          {/* Logo - Centered */}
          <div className="flex items-center justify-center">
            <Image src="/images/Logo.png" width={180} height={180} alt="img" />
          </div>

          {/* Sign In Form */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center lg:text-left">
              Register To B-Way
            </h2>

            <Formik
              initialValues={initialValues}
              enableReinitialize
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
                      <input
                        type="name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Name"
                        readOnly
                        className={`w-full pl-11 pr-4 py-3.5 border ${
                          errors.email && touched.email
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-500 focus:ring-secondary focus:border-secondary"
                        } outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 read-only:bg-gray-100`}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>{" "}
                  {/* Email Field */}
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
                      <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Email"
                        readOnly
                        className={`w-full pl-11 pr-4 py-3.5 border ${
                          errors.email && touched.email
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-500 focus:ring-secondary focus:border-secondary"
                        } outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 read-only:bg-gray-100`}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  {/* Password Field */}
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Password"
                        className={`w-full pl-11 pr-12 py-3.5 border ${
                          errors.password && touched.password
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-500 focus:ring-secondary focus:border-secondary"
                        } outline-none transition-all duration-200 text-gray-900 placeholder-gray-500`}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  {/* Remember Me & Forgot Password */}
                  {/* <div className="flex items-center justify-between">
                    <div className="flex items-center cursor-pointer">
                      <input
                        id="remember-me"
                        name="rememberMe"
                        type="checkbox"
                        checked={values.rememberMe}
                        onChange={handleChange}
                        className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 cursor-pointer"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <Link
                        href="/forgot-password"
                        className="text-gray-600 hover:text-secondary transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div> */}
                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium text-white ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#FF4B00] cursor-pointer hover:bg-[#e63e00]"
                    } transition-colors duration-200`}
                  >
                    {isSubmitting ? "Signing in..." : "Login"}
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section (Desktop Only) */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br">
        <Image
          className="w-full"
          src="/images/Overlay.png"
          width={900}
          height={800}
          alt="Overlay Image"
        />
      </div>
    </div>
  );
}
