import React, { useRef, useState, useEffect } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit3,
  UserPlus,
  RotateCcw,
  Download,
  X,
  Search,
  Bell,
  ChevronDown,
  Trash,
} from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import Layout from "@/components/layout";
import Payout from "@/components/Payout";

function AddEditModal({ isOpen, onClose, mode, facility, onSubmit }) {
  const [formData, setFormData] = useState({
    hospitalName: "",
    contactPerson: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    assignedRoute: "",
    deliveryWindow: "",
    type: "",
  });

  useEffect(() => {
    if (mode === "edit" && facility) {
      setFormData({
        hospitalName: facility.hospitalName || "",
        contactPerson: facility.contactPerson || "",
        phone: facility.phone || "",
        address: facility.address || "",
        city: "",
        state: "",
        zipcode: "",
        assignedRoute: facility.assignedRoute || "",
        deliveryWindow: facility.deliveryWindow || "",
        type: facility.type || "",
      });
    } else {
      // Reset form for add mode
      setFormData({
        hospitalName: "",
        contactPerson: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
        assignedRoute: "",
        deliveryWindow: "",
        type: "",
      });
    }
  }, [mode, facility, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
            {mode === "add"
              ? "Add Billing & Invoice"
              : "Edit Billing & Invoice"}
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
              <label className="block text-sm font-medium text-gray-700">
                Hospital
              </label>
               <select
                name="vehicle"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
                required
              >
                <option value="">Select Vehicle</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Houston">Houston</option>
                <option value="Phoenix">Phoenix</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Courier
              </label>
              <input
                type="email"
                name="enail"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            {/* Row 2 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Invoice Date
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
                placeholder="Invoice Date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            {/* Row 3 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
                placeholder="Invoice Date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
                required
              >
                <option value="">Select Status</option>
                <option value="NY">New York</option>
                <option value="CA">California</option>
                <option value="IL">Illinois</option>
                <option value="TX">Texas</option>
                <option value="AZ">Arizona</option>
              </select>
            </div>

          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="bg-secondary hover:bg-secondary text-white px-8 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BillingInvoices() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [activeTab, setActiveTab] = useState("invoice");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedFacility, setSelectedFacility] = useState(null);

  const handleModalSubmit = (formData) => {
    if (modalMode === "add") {
      const newFacility = {
        ...formData,
        no: facilities.length + 1,
      };
      // setFacilities([...facilities, newFacility]);
    } else if (modalMode === "edit" && selectedFacility) {
      // setFacilities(
      //   facilities.map((f) =>
      //     f.no === selectedFacility.no
      //       ? { ...formData, no: selectedFacility.no }
      //       : f
      //   )
      // );
    }
  };
  const handleEdit = (facility) => {
    setModalMode("edit");
    setSelectedFacility(facility);
    setModalOpen(true);
    setActiveDropdown(null);
  };

    const handleAddNew = () => {
    setModalMode("add");
    setSelectedFacility(null);
    setModalOpen(true);
  };

  const getMenuItems = (row) => [
    {
      label: "View",
      icon: <Eye className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("View clicked", row);
      },
    },
    {
      label: "Edit",
      icon: <Edit3 className="w-5 h-5 text-gray-500" />,
      command: () => {
        handleEdit(row);
      },
    },
    {
      label: "Delete",
      icon: <Trash className="w-5 h-5 text-gray-500" />,
      command: () => {
        console.log("Delete clicked", row);
      },
    },
  ];

  const billingData = [
    {
      no: 1,
      hospitalName: "Jammu Hospital",
      courier: "#COU-0000438756673",
      invoiceDate: "June 15, 2025",
      dueDate: "July 5, 2025",
      amount: 220,
      status: "Unpaid",
    },
    {
      no: 2,
      hospitalName: "Chennai Hospital",
      courier: "#COU-0000438756674",
      invoiceDate: "June 16, 2025",
      dueDate: "July 6, 2025",
      amount: 150,
      status: "Paid",
    },
    {
      no: 3,
      hospitalName: "Oslo Hospital",
      courier: "#COU-0000438756675",
      invoiceDate: "June 17, 2025",
      dueDate: "July 7, 2025",
      amount: 300,
      status: "Paid",
    },
    {
      no: 4,
      hospitalName: "Berlin Hospital",
      courier: "#COU-0000438756676",
      invoiceDate: "June 18, 2025",
      dueDate: "July 8, 2025",
      amount: 400,
      status: "Paid",
    },
    {
      no: 5,
      hospitalName: "New York Hospital",
      courier: "#COU-0000438756677",
      invoiceDate: "June 19, 2025",
      dueDate: "July 9, 2025",
      amount: 700,
      status: "Unpaid",
    },
    {
      no: 6,
      hospitalName: "Oslo Hospital",
      courier: "#COU-0000438756678",
      invoiceDate: "June 20, 2025",
      dueDate: "July 10, 2025",
      amount: 800,
      status: "Paid",
    },
    {
      no: 7,
      hospitalName: "Oslo Hospital",
      courier: "#COU-0000438756679",
      invoiceDate: "June 21, 2025",
      dueDate: "July 11, 2025",
      amount: 900,
      status: "Partially Paid",
    },
    {
      no: 8,
      hospitalName: "Oslo Hospital",
      courier: "#COU-0000438756680",
      invoiceDate: "June 22, 2025",
      dueDate: "July 12, 2025",
      amount: 100,
      status: "Partially Paid",
    },
    {
      no: 9,
      hospitalName: "Oslo Hospital",
      courier: "#COU-0000438756681",
      invoiceDate: "June 23, 2025",
      dueDate: "July 13, 2025",
      amount: 110,
      status: "Unpaid",
    },
    {
      no: 10,
      hospitalName: "Oslo Hospital",
      courier: "#COU-0000438756682",
      invoiceDate: "June 24, 2025",
      dueDate: "July 14, 2025",
      amount: 120,
      status: "Paid",
    },
  ];

  const getStatusStyle = (status) => {
    const statusStyles = {
      Paid: "bg-green-100 text-green-800 border border-green-200",
      Unpaid: "bg-red-100 text-red-800 border border-red-200",
      "Partially Paid":
        "bg-yellow-100 text-yellow-800 border border-yellow-200",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Layout title="Billing & Invoices">
      {/* Main Content */}
      <div className="bg-white shadow-sm overflow-hidden rounded-lg">
        {/* Add New Button */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("invoice")}
              className={`text-base lg:text-lg font-bold pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === "invoice"
                  ? "text-[#003C72] border-[#003C72]"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              All Billing & Invoices
            </button>
            <button
              onClick={() => setActiveTab("driver")}
              className={`text-base lg:text-lg font-bold pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === "driver"
                  ? "text-[#003C72] border-[#003C72]"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              Driver Payouts
            </button>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700"
          >
            Add New
          </button>
        </div>

        {/* Table with Horizontal Scroll for All Screen Sizes */}
        {activeTab === "invoice" ? (<DataTable
          value={billingData}
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
          rowClassName={() => "hover:bg-gray-50"}
          size="small"
          // style={{ overflow: "visible" }}
          // scrollable={false}
          // columnResizeMode="expand"
          // resizableColumns
          paginator
          rows={10}
          // rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column
            field="no"
            header="No."
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="hospitalName"
            header="Hospital Name"
            bodyStyle={{
              verticalAlign: "middle",
              fontSize: "14px",
            }}
          />
          <Column
            field="courier"
            header="Courier"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="invoiceDate"
            header="Invoice Date"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="dueDate"
            header="Due Date"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="amount"
            header="Amount"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="status"
            header="Status"
            body={(rowData) => getStatusStyle(rowData.status)}
          />
          <Column
            header="Action"
            bodyStyle={{
              verticalAlign: "middle",
              textAlign: "center",
              overflow: "visible",
              position: "relative",
            }}
            body={(rowData, options) => (
              <div className="relative flex justify-center">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSelectedRowData(rowData);
                    menuRef.current.toggle(event);
                  }}
                  className="p-1 rounded hover:bg-gray-100 focus:outline-none"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}
          />
        </DataTable>) : <Payout />}
      </div>
      <Menu
        model={selectedRowData ? getMenuItems(selectedRowData) : []}
        popup
        ref={menuRef}
        id="popup_menu"
      />

      <AddEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        facility={selectedFacility}
        onSubmit={handleModalSubmit}
      />
    </Layout>
  );
}
