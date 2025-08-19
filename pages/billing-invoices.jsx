import React, { useRef, useState, useEffect, use } from "react";
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
import { Api } from "@/helper/service";
import { useRouter } from "next/router";
import Currency from "@/helper/currency";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchHospital } from "@/store/hospitalSlice";
import toast from "react-hot-toast";

function AddEditModal({ isOpen, onClose, mode, facility, onSubmit }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    hospital: "",
    courier: "",
    invoiceDate: "",
    dueDate: "",
    amount: "",
    status: "",
  });

  const { hospitals } = useSelector((state) => state.hospital);

  useEffect(() => {
    dispatch(fetchHospital());
  }, [dispatch]);

  useEffect(() => {
    if (mode === "edit" && facility) {
      setFormData({
        hospital: facility.hospital.name || "",
        courier: facility.courier || "",
        invoiceDate: facility.invoiceDate
          ? moment(facility.invoiceDate).format("YYYY-MM-DD")
          : "",
        dueDate: facility.dueDate
          ? moment(facility.dueDate).format("YYYY-MM-DD")
          : "",
        amount: facility.amount || "",
        status: facility.status || "",
      });
    } else {
      setFormData({
        hospital: "",
        courier: "",
        invoiceDate: "",
        dueDate: "",
        amount: "",
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
                name="hospital"
                value={formData.hospital}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary bg-white text-gray-700"
                required
              >
                <option value="">Select Hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital._id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Courier
              </label>
              <input
                type="text"
                name="courier"
                value={formData.courier}
                onChange={handleInputChange}
                placeholder="Courier"
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
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Amount"
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
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                placeholder="Due Date"
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
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Overdue">Overdue</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Cancelled">Cancelled</option>
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

export default function BillingInvoices({ loader }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [activeTab, setActiveTab] = useState("invoice");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [billingData, setBillingData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const router = useRouter();

  const fetchBillingData = async () => {
    loader(true);

    Api("get", `/billing?page=${currentPage}&limit=${limit}`, null, router)
      .then((response) => {
        console.log("Billing data fetched:", response);
        setBillingData(response.data || []);
        setTotalOrders(response.totalBillings);
        setCurrentPage(response.currentPage);
      })
      .catch((error) => {
        console.error("Error fetching billing data:", error);
      })
      .finally(() => {
        loader(false);
      });
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingDataById = (id) => {
    loader(true);
    Api("GET", `/billing/${id}`)
      .then((res) => {
        console.log("Billing details fetched:", res);
        setSelectedFacility(res);
      })
      .catch((err) => {
        toast.error(
          err?.message || "Failed to fetch route details. Please try again."
        );
      })
      .finally(() => {
        loader(false);
      });
  };

  const handleModalSubmit = (formData) => {
    loader(true);
    if (modalMode === "add") {
      Api("POST", "/billing", formData)
        .then((res) => {
          console.log("New facility added:", res);
          toast.success("Invoice added successfully");
          fetchBillingData();
        })
        .catch((err) => {
          toast.error("Failed to add invoice");
          console.error("Error adding facility:", err);
        })
        .finally(() => {
          loader(false);
        });
    } else if (modalMode === "edit" && selectedFacility) {
      const updatedFacility = {
        ...selectedFacility,
        ...formData,
      };
      Api("PUT", `/billing/${selectedFacility._id}`, updatedFacility)
        .then((res) => {
          console.log("Facility updated:", res);
          toast.success("Invoice updated successfully");
          fetchBillingData();
        })
        .catch((err) => {
          toast.error("Failed to edit invoice");
          console.error("Error updating facility:", err);
        })
        .finally(() => {
          loader(false);
        });
    }
  };
  const handleEdit = (data) => {
    setModalMode("edit");
    // setSelectedFacility(data);
    setModalOpen(true);
    setActiveDropdown(null);
    fetchBillingDataById(data._id);
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
        Api("DELETE", `/billing/${row._id}`)
          .then((res) => {
            console.log("Billing deleted:", res);
            toast.success("Billing deleted successfully");
            fetchBillingData();
          })
          .catch((err) => {
            toast.error("Failed to delete billing");
            console.error("Error deleting billing:", err);
          });
      },
    },
  ];

  const getStatusStyle = (status) => {
    const statusStyles = {
      Paid: "bg-green-100 text-green-800 border border-green-200",
      Unpaid: "bg-red-100 text-red-800 border border-red-200",
      "Partially Paid":
        "bg-yellow-100 text-yellow-800 border border-yellow-200",
      Cancelled: "bg-gray-100 text-gray-800 border border-gray-200",
      Pending: "bg-blue-100 text-blue-800 border border-blue-200",
      Overdue: "bg-orange-100 text-orange-800 border border-orange-200",
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

  const formatDate = (dateString) => {
    return moment(dateString).format("MMMM D, YYYY");
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handlePageChange = (event) => {
    setCurrentPage(event.page + 1);
  };

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
        {activeTab === "invoice" ? (
          <DataTable
            value={billingData}
            stripedRows
            tableStyle={{ minWidth: "50rem" }}
            rowClassName={() => "hover:bg-gray-50"}
            size="small"
            paginator
            rows={limit}
            totalRecords={totalOrders}
            first={(currentPage - 1) * limit}
            lazy
            onPage={handlePageChange}
          >
            <Column
              field="index"
              header="No."
              bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            />
            <Column
              field="hospital.name"
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
              body={(rowData) => <span>{formatDate(rowData.invoiceDate)}</span>}
            />
            <Column
              field="dueDate"
              header="Due Date"
              bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
              body={(rowData) => <span>{formatDate(rowData.dueDate)}</span>}
            />
            <Column
              header="Amount"
              bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
              body={(rowData) => <span>{Currency(rowData.amount)}</span>}
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
        ) : (
          <Payout loader={loader} />
        )}
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
