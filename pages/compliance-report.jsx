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

function AddEditModal({ isOpen, onClose, mode, facility, onSubmit }) {
  const [formData, setFormData] = useState({
    date: "",
    regulationType: "",
    audit: "",
    violation: "",
    violationType: "",
    status: "",
  });

  useEffect(() => {
    if (mode === "edit" && facility) {
      setFormData({
        date: facility.date || "",
        regulationType: facility.regulationType || "",
        audit: facility.audit || "",
        violation: facility.violation || "",
        violationType: facility.violationType || "",
        status: facility.status || "",
      });
    } else {
      // Reset form for add mode
      setFormData({
        date: "",
        regulationType: "",
        audit: "",
        violation: "",
        violationType: "",
        status: "",
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
            {mode === "add" ? "Add Compliance Report" : "Edit Compliance Report"}
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
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="Date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Regulation Type
              </label>
              <input
                type="text"
                name="regulationType"
                value={formData.regulationType}
                onChange={handleInputChange}
                placeholder="Regulation Type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Audit
              </label>
              <input
                type="text"
                name="audit"
                value={formData.audit}
                onChange={handleInputChange}
                placeholder="Audit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Violation
              </label>
              <input
                type="text"
                name="violation"
                value={formData.violation}
                onChange={handleInputChange}
                placeholder="Violation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary text-gray-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Violation Type
              </label>
              <input
                type="text"
                name="violationType"
                value={formData.violationType}
                onChange={handleInputChange}
                placeholder="Violation Type"
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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

function Compliances() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
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
        console.log("Edit clicked", row);
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

  const complianceData = [
    {
      no: 1,
      date: "June 15, 2025",
      regulationType: "Hipaa",
      audit: 50,
      violation: 50,
      violationType: "Data Breach",
      status: "Pending",
    },
    {
      no: 2,
      date: "June 16, 2025",
      regulationType: "GDPR",
      audit: 30,
      violation: 20,
      violationType: "Data Processing",
      status: "Pending",
    },
    {
      no: 3,
      date: "June 17, 2025",
      regulationType: "PCI DSS",
      audit: 40,
      violation: 10,
      violationType: "Payment Security",
      status: "Completed",
    },
    {
      no: 4,
      date: "June 18, 2025",
      regulationType: "SOX",
      audit: 60,
      violation: 15,
      violationType: "Financial Reporting",
      status: "Completed",
    },
    {
      no: 5,
      date: "June 19, 2025",
      regulationType: "FISMA",
      audit: 70,
      violation: 25,
      violationType: "Information Security",
      status: "Pending",
    },
    {
      no: 6,
      date: "June 20, 2025",
      regulationType: "HIPAA",
      audit: 80,
      violation: 30,
      violationType: "Data Privacy",
      status: "Completed",
    },
    {
      no: 7,
      date: "June 21, 2025",
      regulationType: "GDPR",
      audit: 90,
      violation: 35,
      violationType: "Data Protection",
      status: "Pending",
    },
    {
      no: 8,
      date: "June 22, 2025",
      regulationType: "PCI DSS",
      audit: 100,
      violation: 40,
      violationType: "Payment Processing",
      status: "Completed",
    },
    {
      no: 9,
      date: "June 23, 2025",
      regulationType: "SOX",
      audit: 110,
      violation: 45,
      violationType: "Financial Compliance",
      status: "Pending",
    },
    {
      no: 10,
      date: "June 24, 2025",
      regulationType: "FISMA",
      audit: 120,
      violation: 50,
      violationType: "Information Assurance",
      status: "Completed",
    },
  ];

  const getStatusStyle = (status) => {
    const statusStyles = {
      Completed: "bg-green-100 text-green-800 border border-green-200",
      Pending: "bg-red-100 text-red-800 border border-red-200",
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
    <Layout title="Compliances Report">
      {/* Main Content */}
      <div className="bg-white shadow-sm overflow-hidden rounded-lg">
        {/* Add New Button */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            All Compliances
          </span>
          <button
            onClick={handleAddNew}
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700"
          >
            Add New
          </button>
        </div>

        {/* Table with Horizontal Scroll for All Screen Sizes */}
        <DataTable
          value={complianceData}
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
            field="date"
            header="Date"
            bodyStyle={{
              verticalAlign: "middle",
              fontSize: "14px",
            }}
          />
          <Column
            field="regulationType"
            header="Regulation Type"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="audit"
            header="Total Deliveries Audit"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="violation"
            header="Violation Detected"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="violationType"
            header="Violation Type"
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
        </DataTable>
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

export default Compliances;
