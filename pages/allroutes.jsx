import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit3, UserPlus, RotateCcw, Download, Menu, X, Search, Bell, ChevronDown, Clock } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

function RoutesSchedules() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    routeName: '',
    startAddress: '',
    startCity: '',
    startState: '',
    startZipcode: '',
    endAddress: '',
    endCity: '',
    endState: '',
    endZipcode: '',
    stops: '',
    assignedDriver: '',
    eta: '',
    activeDays: '',
    status: ''
  });

  const routes = [
    {
      no: 1,
      routeName: 'Route A - North Bergen',
      startLocation: '47 W 13th St, New York',
      endLocation: '20 Cooper Square, New York',
      stops: 'Jammu Hospital',
      assignedDriver: 'David M.',
      eta: '2:10 PM',
      activeDays: 'Mon-Fri',
      status: 'Archive'
    },
    {
      no: 2,
      routeName: 'Route B - North Bergen',
      startLocation: '20 Cooper Square, New York',
      endLocation: '47 W 13th St, New York',
      stops: 'Capitol Hospital',
      assignedDriver: 'Carla G.',
      eta: '8:52 PM',
      activeDays: 'Sat only',
      status: 'Completed'
    },
    {
      no: 3,
      routeName: 'Route C - North Bergen',
      startLocation: '47 W 13th St, New York',
      endLocation: '20 Cooper Square, New York',
      stops: 'Jim Pharmacy',
      assignedDriver: 'David J.',
      eta: '8:52 AM',
      activeDays: 'Mon-Fri',
      status: 'Active'
    },
    {
      no: 4,
      routeName: 'Route D - North Bergen',
      startLocation: '20 Cooper Square, New York',
      endLocation: '47 W 13th St, New York',
      stops: 'Bellevue Hospital',
      assignedDriver: 'Catrin D.',
      eta: '8:52 PM',
      activeDays: 'Sat only',
      status: 'Completed'
    },
    {
      no: 5,
      routeName: 'Route A - North Bergen',
      startLocation: '47 W 13th St, New York',
      endLocation: '20 Cooper Square, New York',
      stops: 'Oxford Hospital',
      assignedDriver: 'David M.',
      eta: '8:52 AM',
      activeDays: 'Mon-Fri',
      status: 'Archive'
    },
    {
      no: 6,
      routeName: 'Route B - North Bergen',
      startLocation: '20 Cooper Square, New York',
      endLocation: '47 W 13th St, New York',
      stops: 'Carla G.',
      assignedDriver: 'Carla G.',
      eta: '8:52 AM',
      activeDays: 'Sat only',
      status: 'Active'
    },
    {
      no: 7,
      routeName: 'Route C - North Bergen',
      startLocation: '47 W 13th St, New York',
      endLocation: '20 Cooper Square, New York',
      stops: 'Capitol Hospital',
      assignedDriver: 'David J.',
      eta: '8:52 AM',
      activeDays: 'Mon-Fri',
      status: 'Archive'
    },
    {
      no: 8,
      routeName: 'Route D - North Bergen',
      startLocation: '20 Cooper Square, New York',
      endLocation: '47 W 13th St, New York',
      stops: 'Bellevue Hospital',
      assignedDriver: 'Catrin D.',
      eta: '8:52 AM',
      activeDays: 'Sat only',
      status: 'Completed'
    },
    {
      no: 9,
      routeName: 'Route A - North Bergen',
      startLocation: '47 W 13th St, New York',
      endLocation: '20 Cooper Square, New York',
      stops: 'Jammu Hospital',
      assignedDriver: 'David M.',
      eta: '8:52 AM',
      activeDays: 'Mon-Fri',
      status: 'Archive'
    },
    {
      no: 10,
      routeName: 'Route B - North Bergen',
      startLocation: '20 Cooper Square, New York',
      endLocation: '47 W 13th St, New York',
      stops: 'Oxford Hospital',
      assignedDriver: 'Carla G.',
      eta: '8:52 AM',
      activeDays: 'Sat only',
      status: 'Completed'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setEditingRoute(null);
    setFormData({
      routeName: '',
      startAddress: '',
      startCity: '',
      startState: '',
      startZipcode: '',
      endAddress: '',
      endCity: '',
      endState: '',
      endZipcode: '',
      stops: '',
      assignedDriver: '',
      eta: '',
      activeDays: '',
      status: ''
    });
    setShowModal(true);
  };

  const openEditModal = (route) => {
    setEditingRoute(route);
    setFormData({
      routeName: route.routeName,
      startAddress: route.startLocation,
      startCity: '',
      startState: '',
      startZipcode: '',
      endAddress: route.endLocation,
      endCity: '',
      endState: '',
      endZipcode: '',
      stops: route.stops,
      assignedDriver: route.assignedDriver,
      eta: route.eta,
      activeDays: route.activeDays,
      status: route.status
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setShowModal(false);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'archive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:w-64`}>
        <Sidebar />
      </div>
      
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full lg:w-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title="All Routes & Schedules" />
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="bg-white shadow-sm overflow-hidden">
            
            {/* Add New Button */}
            <div className="px-4 py-3 border-b border-gray-200 flex justify-end">
              <button 
                onClick={openAddModal}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700"
              >
                Add New
              </button>
            </div>
            
            {/* Table with Horizontal Scroll for All Screen Sizes */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-[#003C72] text-white">
                  <tr>
                    <th className="w-12 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">No.</th>
                    <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Route Name</th>
                    <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Start Location</th>
                    <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">End Location</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Stops</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Assigned Driver</th>
                    <th className="w-20 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">ETA</th>
                    <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Active Days</th>
                    <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {routes.map((route, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{route.no}</td>
                      <td className="px-2 py-2 text-sm text-orange-500 font-medium truncate">{route.routeName}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate" title={route.startLocation}>{route.startLocation}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate" title={route.endLocation}>{route.endLocation}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{route.stops}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{route.assignedDriver}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{route.eta}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{route.activeDays}</td>
                      <td className="px-2 py-2 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                          {route.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-sm relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(index);
                          }}
                          className="p-1 rounded hover:bg-gray-100 focus:outline-none"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>
                        
                        {activeDropdown === index && (
                          <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                            <button className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </button>
                            <button 
                              onClick={() => {
                                openEditModal(route);
                                setActiveDropdown(null);
                              }}
                              className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">
                              <UserPlus className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-center space-x-2">
              <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm font-medium">1</button>
              <button className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm">2</button>
              <button className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm">3</button>
              <span className="text-gray-500 px-2">...</span>
              <button className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm">10</button>
              <button className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded text-sm">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#003C72]">
                {editingRoute ? 'Edit Routes & Schedules' : 'Add Routes & Schedules'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Route Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Route Name
                </label>
                <input
                  type="text"
                  name="routeName"
                  value={formData.routeName}
                  onChange={handleInputChange}
                  placeholder="Route Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
              </div>

              {/* Start Location */}
              <div>
                <label className="block text-sm font-bold text-[#003C72] mb-2">
                  Start Location
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <input
                      type="text"
                      name="startAddress"
                      value={formData.startAddress}
                      onChange={handleInputChange}
                      placeholder="Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                  </div>
                  <div>
                    <select
                      name="startCity"
                      value={formData.startCity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">Select City</option>
                      <option value="New York">New York</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="Chicago">Chicago</option>
                    </select>
                  </div>
                  <div>
                    <select
                      name="startState"
                      value={formData.startState}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">Select State</option>
                      <option value="NY">New York</option>
                      <option value="CA">California</option>
                      <option value="IL">Illinois</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="startZipcode"
                      value={formData.startZipcode}
                      onChange={handleInputChange}
                      placeholder="Zipcode"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* End Location */}
              <div>
                <label className="block text-sm font-bold text-[#003C72] mb-2">
                  End Location
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <input
                      type="text"
                      name="endAddress"
                      value={formData.endAddress}
                      onChange={handleInputChange}
                      placeholder="Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                  </div>
                  <div>
                    <select
                      name="endCity"
                      value={formData.endCity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">Select City</option>
                      <option value="New York">New York</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="Chicago">Chicago</option>
                    </select>
                  </div>
                  <div>
                    <select
                      name="endState"
                      value={formData.endState}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">Select State</option>
                      <option value="NY">New York</option>
                      <option value="CA">California</option>
                      <option value="IL">Illinois</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="endZipcode"
                      value={formData.endZipcode}
                      onChange={handleInputChange}
                      placeholder="Zipcode"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Stops */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stops
                  </label>
                  <select
                    name="stops"
                    value={formData.stops}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  >
                    <option value="">Select Stops</option>
                    <option value="Jammu Hospital">Jammu Hospital</option>
                    <option value="Capitol Hospital">Capitol Hospital</option>
                    <option value="Bellevue Hospital">Bellevue Hospital</option>
                    <option value="Oxford Hospital">Oxford Hospital</option>
                    <option value="Jim Pharmacy">Jim Pharmacy</option>
                  </select>
                </div>

                {/* Assigned Driver */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Driver
                  </label>
                  <select
                    name="assignedDriver"
                    value={formData.assignedDriver}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  >
                    <option value="">Select Assigned Driver</option>
                    <option value="David M.">David M.</option>
                    <option value="Carla G.">Carla G.</option>
                    <option value="David J.">David J.</option>
                    <option value="Catrin D.">Catrin D.</option>
                  </select>
                </div>

                {/* ETA */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ETA
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="eta"
                      value={formData.eta}
                      onChange={handleInputChange}
                      placeholder="2:10 PM"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Active Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active Days
                  </label>
                  <select
                    name="activeDays"
                    value={formData.activeDays}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  >
                    <option value="">Select Active Days</option>
                    <option value="Mon-Fri">Mon-Fri</option>
                    <option value="Sat only">Sat only</option>
                    <option value="Sun only">Sun only</option>
                    <option value="Mon-Sun">Mon-Sun</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Archive">Archive</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-md font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoutesSchedules;