import React, { useContext, useState } from 'react';
import { Search, Bell, ChevronDown, Menu, X, Lock } from "lucide-react";
import { useRouter } from "next/router";
import { LogOut } from "lucide-react";
import Sidebar from "./sidebar";
import { userContext } from '@/pages/_app';
import LiveClock from './LiveClock';

export default function Layout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  
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
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
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
                        // onClick={() => {
                        //   router.push("/change-password");
                        // }}
                        className="px-4 py-2 text-primary hover:bg-gray-100 cursor-pointer text-sm
                      transition-colors"
                      >
                        <Lock className="inline-block mr-2 w-4 h-4" />
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
        
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
