import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Eye, Edit3, UserPlus, RotateCcw, Download, Menu, X, Search, Bell, ChevronDown, Clock } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

// Add/Edit Modal Component
function AddEditModal({ isOpen, onClose, mode, facility, onSubmit }) {
  const [formData, setFormData] = useState({
    hospitalName: '',
    contactPerson: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    assignedRoute: '',
    deliveryWindow: '',
    type: ''
  });

  useEffect(() => {
    if (mode === 'edit' && facility) {
      setFormData({
        hospitalName: facility.hospitalName || '',
        contactPerson: facility.contactPerson || '',
        phone: facility.phone || '',
        address: facility.address || '',
        city: '',
        state: '',
        zipcode: '',
        assignedRoute: facility.assignedRoute || '',
        deliveryWindow: facility.deliveryWindow || '',
        type: facility.type || ''
      });
    } else {
      // Reset form for add mode
      setFormData({
        hospitalName: '',
        contactPerson: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
        assignedRoute: '',
        deliveryWindow: '',
        type: ''
      });
    }
  }, [mode, facility, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#003C72]">
            {mode === 'add' ? 'Add Drivers & Vehicles' : 'Edit Drivers & Vehicles'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Row 1 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="Contact Person"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                required
              />
            </div>

            {/* Row 2 */}
            <div className="space-y-2 md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                required
              />
            </div>

            {/* Row 3 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700"
                required
              >
                <option value="">Select City</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Houston">Houston</option>
                <option value="Phoenix">Phoenix</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700"
                required
              >
                <option value="">Select State</option>
                <option value="NY">New York</option>
                <option value="CA">California</option>
                <option value="IL">Illinois</option>
                <option value="TX">Texas</option>
                <option value="AZ">Arizona</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Zipcode</label>
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleInputChange}
                placeholder="Zipcode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                required
              />
            </div>

            {/* Row 4 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Assigned Route</label>
              <select
                name="assignedRoute"
                value={formData.assignedRoute}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700"
                required
              >
                <option value="">Select Assigned Route</option>
                <option value="David M.">David M.</option>
                <option value="Carla G.">Carla G.</option>
                <option value="David J.">David J.</option>
                <option value="Catrin D.">Catrin D.</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Delivery Window</label>
              <div className="relative">
                <input
                  type="text"
                  name="deliveryWindow"
                  value={formData.deliveryWindow}
                  onChange={handleInputChange}
                  placeholder="2PM-6PM"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                  required
                />
                <Clock className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700"
                required
              >
                <option value="">Select Type</option>
                <option value="Hospital">Hospital</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Clinic">Clinic</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Component
function HospitalsFacilities() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedFacility, setSelectedFacility] = useState(null);

  const [facilities, setFacilities] = useState([
    {
      no: 1,
      hospitalName: 'Jammu Hospital',
      address: '47 W 13th St, New York',
      contactPerson: 'David M.',
      phone: '000-000-0000',
      assignedRoute: 'David M.',
      deliveryWindow: '2PM-6PM',
      type: 'Hospital'
    },
    {
      no: 2,
      hospitalName: 'Columbia Peds',
      address: '20 Cooper Square, New York',
      contactPerson: 'Carla G.',
      phone: '000-000-0000',
      assignedRoute: 'Carla G.',
      deliveryWindow: '2PM-6PM',
      type: 'Pharmacy'
    },
    {
      no: 3,
      hospitalName: 'Oxford Hospital',
      address: '47 W 13th St, New York',
      contactPerson: 'David M.',
      phone: '000-000-0000',
      assignedRoute: 'David J.',
      deliveryWindow: '2PM-6PM',
      type: 'Clinic'
    },
    {
      no: 4,
      hospitalName: 'Jammu Hospital',
      address: '20 Cooper Square, New York',
      contactPerson: 'Carla G.',
      phone: '000-000-0000',
      assignedRoute: 'Catrin D.',
      deliveryWindow: '2PM-6PM',
      type: 'Hospital'
    },
    {
      no: 5,
      hospitalName: 'Bellevue Hospital',
      address: '47 W 13th St, New York',
      contactPerson: 'David M.',
      phone: '000-000-0000',
      assignedRoute: 'David M.',
      deliveryWindow: '2PM-6PM',
      type: 'Pharmacy'
    },
    {
      no: 6,
      hospitalName: 'Retarice Lospit',
      address: '20 Cooper Square, New York',
      contactPerson: 'Carla G.',
      phone: '000-000-0000',
      assignedRoute: 'Carla G.',
      deliveryWindow: '2PM-6PM',
      type: 'Clinic'
    },
    {
      no: 7,
      hospitalName: 'Oxford Hospital',
      address: '47 W 13th St, New York',
      contactPerson: 'David M.',
      phone: '000-000-0000',
      assignedRoute: 'David J.',
      deliveryWindow: '2PM-6PM',
      type: 'Hospital'
    },
    {
      no: 8,
      hospitalName: 'Jammu Hospital',
      address: '20 Cooper Square, New York',
      contactPerson: 'Carla G.',
      phone: '000-000-0000',
      assignedRoute: 'Catrin D.',
      deliveryWindow: '2PM-6PM',
      type: 'Pharmacy'
    },
    {
      no: 9,
      hospitalName: 'NYU Langone',
      address: '47 W 13th St, New York',
      contactPerson: 'David M.',
      phone: '000-000-0000',
      assignedRoute: 'David M.',
      deliveryWindow: '2PM-6PM',
      type: 'Clinic'
    },
    {
      no: 10,
      hospitalName: 'Columbia Peds',
      address: '20 Cooper Square, New York',
      contactPerson: 'Carla G.',
      phone: '000-000-0000',
      assignedRoute: 'Carla G.',
      deliveryWindow: '2PM-6PM',
      type: 'Hospital'
    }
  ]);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  const handleAddNew = () => {
    setModalMode('add');
    setSelectedFacility(null);
    setModalOpen(true);
  };

  const handleEdit = (facility) => {
    setModalMode('edit');
    setSelectedFacility(facility);
    setModalOpen(true);
    setActiveDropdown(null);
  };

  const handleModalSubmit = (formData) => {
    if (modalMode === 'add') {
      const newFacility = {
        ...formData,
        no: facilities.length + 1
      };
      setFacilities([...facilities, newFacility]);
    } else if (modalMode === 'edit' && selectedFacility) {
      setFacilities(facilities.map(f => 
        f.no === selectedFacility.no 
          ? { ...formData, no: selectedFacility.no }
          : f
      ));
    }
  };

  useEffect(() => {
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
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title="All Hospitals & Facilities" />
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="bg-white shadow-sm overflow-hidden">
            
            {/* Add New Button */}
            <div className="px-4 py-3 border-b border-gray-200 flex justify-end">
              <button 
                onClick={handleAddNew}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors"
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
                    <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Hospital Name</th>
                    <th className="w-40 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Address</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact Person</th>
                    <th className="w-28 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Assigned Route</th>
                    <th className="w-32 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Delivery Window</th>
                    <th className="w-24 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                    <th className="w-16 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facilities.map((facility, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{facility.no}</td>
                      <td className="px-2 py-2 text-sm text-orange-500 font-medium truncate">{facility.hospitalName}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate" title={facility.address}>{facility.address}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{facility.contactPerson}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{facility.phone}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{facility.assignedRoute}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{facility.deliveryWindow}</td>
                      <td className="px-2 py-2 text-sm text-gray-900 truncate">{facility.type}</td>
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
                              onClick={() => handleEdit(facility)}
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
      <AddEditModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        facility={selectedFacility}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}

export default HospitalsFacilities;