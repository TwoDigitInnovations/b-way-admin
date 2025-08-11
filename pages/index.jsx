import React, { useContext, useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Api } from "@/helper/service";
import { Formik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { userContext } from "./_app";
import Cookies from "js-cookie";
import Link from "next/link";

export default function BWayLoginPage({ loader }) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [user, setUser] = useContext(userContext);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const { email, password, rememberMe } = values;
    
    // Show loader
    loader(true);

    Api("POST", "/auth/login", { email, password, rememberMe }, router)
      .then((res) => {
        if (res?.status) {
          localStorage.setItem("token", res.data.token);
          Cookies.set("token", res.data.token);
          localStorage.setItem("userDetail", JSON.stringify(res.data.user));
          setUser(res.data.user); // Update user context
          // router.push(res.data.user?.role === "ADMIN" ? "/dashboard" : "/dashboard");
          router.push("/dashboard")
          toast.success("Login successful!");
          console.log("Login successful:", res);
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
              Sign in
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
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        className={`w-full pl-11 pr-4 py-3.5 border ${
                          errors.email && touched.email
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-500 focus:ring-secondary focus:border-secondary"
                        } outline-none transition-all duration-200 text-gray-900 placeholder-gray-500`}
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
                  <div className="flex items-center justify-between">
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
                  </div>

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
