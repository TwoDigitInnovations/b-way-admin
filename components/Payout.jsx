import Currency from "@/helper/currency";
import { Api } from "@/helper/service";
import { Download } from "lucide-react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputSwitch } from "primereact/inputswitch";
import React, { useEffect, useState } from "react";

const getStatusStyle = (status) => {
  const statusStyles = {
    Paid: "bg-green-100 text-green-800 border border-green-200",
    Unpaid: "bg-red-100 text-red-800 border border-red-200",
    Pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
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

export default function Payout({ loader }) {
  const [emailReminder, setEmailReminder] = useState(false);
  const [smsReminder, setSmsReminder] = useState(false);
  const [statData, setStatData] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const fetchPayouts = async () => {
    loader(true);
    Api("get", `/payout?page=${currentPage}&limit=${limit}`, null, null)
      .then((response) => {
        setPayouts(response.data);
        setTotalOrders(response.totalPayouts);
        setCurrentPage(response.currentPage);
      })
      .catch((error) => {
        console.error("Error fetching payouts:", error);
      })
      .finally(() => {
        loader(false);
      });
  };

  const fetchStats = async () => {
    loader(true);
    Api("get", `/payout/stats`, null, null)
      .then((response) => {
        setStatData(response.data);
        console.log("Stats fetched successfully:", response);
      })
      .catch((error) => {
        console.error("Error fetching payouts:", error);
      })
      .finally(() => {
        loader(false);
      });
  };

  useEffect(() => {
    fetchPayouts();
    fetchStats();
  }, []);

  const summary = [
    {
      label: "Total Billed (This Month)",
      value: Currency(statData?.totalBilledThisMonth || 0),
    },
    {
      label: "Total Paid (This Month)",
      value: Currency(statData?.totalPaidThisMonth || 0),
    },
    {
      label: "Outstanding Invoices",
      value: statData?.outstandingInvoices || "0",
    },
    {
      label: "Client-wise Receivables",
      value: Currency(
        statData?.clientWiseReceivables?.reduce(
          (sum, item) => sum + (item.total || 0),
          0
        ) || 0
      ),
    },
  ];

  const handlePageChange = (event) => {
    setCurrentPage(event.page + 1);
  };

  return (
    <div className="h-screen">
      {/* Financial Summary */}
      <section className="flex gap-6 px-10 mt-8">
        {summary.map((item) => (
          <div
            className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col w-60"
            key={item.label}
          >
            <span className="text-xs text-gray-500 mb-2">{item.label}</span>
            <span className="text-2xl font-bold text-blue-900">
              {item.value}
            </span>
          </div>
        ))}
      </section>

      {/* Download Report Button */}
      <div className="px-10 mt-6">
        <button className="bg-secondary hover:bg-secondary text-white text-sm font-semibold px-5 py-2 rounded">
          <Download className="inline mr-2 h-5 w-5" />
          Download Report
        </button>
      </div>

      {/* Table Section */}
      <DataTable
        value={payouts}
        stripedRows
        tableStyle={{ minWidth: "50rem", marginTop: "40px" }}
        rowClassName={() => "hover:bg-gray-50"}
        size="small"
        paginator
        rows={limit}
        totalRecords={totalOrders}
        first={(currentPage - 1) * limit}
        lazy
        onPage={handlePageChange}
      >
        {/* <Column
            field="no"
            header="No."
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData, options) => options.rowIndex + 1}
          /> */}
        <Column
          field="payoutId"
          header="Payout ID"
          bodyStyle={{
            verticalAlign: "middle",
            fontSize: "14px",
          }}
        />
        <Column
          field="driver.name"
          header="Driver Name & ID"
          bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
        />
        <Column
          field="deliveries"
          header="Number of Deliveries Completed"
          bodyStyle={{
            verticalAlign: "middle",
            fontSize: "14px",
            textAlign: "center",
          }}
        />
        <Column
          field="payoutRate"
          header="Payout Rate (per Delivery)"
          bodyStyle={{
            verticalAlign: "middle",
            fontSize: "14px",
            textAlign: "center",
          }}
        />
        <Column
          field="totalPayout"
          header="Total Payout"
          bodyStyle={{
            verticalAlign: "middle",
            fontSize: "14px",
            textAlign: "center",
          }}
        />
        <Column
          field="deductions"
          header="Deductions"
          bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
        />
        <Column
          field="bonus"
          header="Bonuses"
          bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
        />
        <Column
          field="paymentMethod"
          header="Payment Method"
          bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
        />
        <Column
          field="status"
          header="Status"
          body={(rowData) => getStatusStyle(rowData.status)}
        />
      </DataTable>

      {/* Settings Toggles */}
      <section className="px-10 mt-10 mb-8">
        <h2 className="text-lg font-semibold mb-3 text-blue-900">Settings</h2>
        <div className="grid md:grid-cols-2 gap-y-4">
          <ToggleSetting
            label="Auto Email Reminders for Unpaid Invoices"
            checked={emailReminder}
            onChange={() => setEmailReminder(!emailReminder)}
          />
          <ToggleSetting
            label="Auto SMS Reminders for Unpaid Invoices"
            checked={smsReminder}
            onChange={() => setSmsReminder(!smsReminder)}
          />
        </div>
      </section>
    </div>
  );
}

function ToggleSetting({ label, checked, onChange }) {
  const [isChecked, setIsChecked] = useState(checked);
  return (
    <div className="flex items-center justify-between py-2 max-w-xl">
      <span className="text-gray-700 font-medium">{label}</span>
      <label className="inline-flex items-center cursor-pointer">
        <InputSwitch
          checked={isChecked}
          onChange={(e) => setIsChecked(e.value)}
        />
      </label>
    </div>
  );
}
