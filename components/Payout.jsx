import Currency from "@/helper/currency";
import { Download } from "lucide-react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputSwitch } from "primereact/inputswitch";
import React, { useState } from "react";

const payouts = [
  {
    id: "PYT001",
    driver: "Ethan Carter",
    driverId: "12345",
    deliveries: 20,
    rate: 10,
    payout: 200,
    deduction: 20,
    bonus: 10,
    method: "ACH",
    status: "Paid"
  },
  {
    id: "PYT002",
    driver: "Ethan Carter",
    driverId: "12456",
    deliveries: 20,
    rate: 10,
    payout: 200,
    deduction: 20,
    bonus: 10,
    method: "ACH",
    status: "Pending"
  },
  {
    id: "PYT003",
    driver: "Ethan Carter",
    driverId: "122245",
    deliveries: 20,
    rate: 10,
    payout: 200,
    deduction: 20,
    bonus: 10,
    method: "ACH",
    status: "Paid"
  },
  {
    id: "PYT004",
    driver: "Ethan Carter",
    driverId: "123345",
    deliveries: 20,
    rate: 10,
    payout: 200,
    deduction: 20,
    bonus: 10,
    method: "ACH",
    status: "Pending"
  },
  {
    id: "PYT005",
    driver: "Ethan Carter",
    driverId: "123345",
    deliveries: 20,
    rate: 10,
    payout: 200,
    deduction: 20,
    bonus: 10,
    method: "ACH",
    status: "Paid"
  }
];

const summary = [
  { label: "Total Billed (This Month)", value: Currency(25000) },
  { label: "Total Paid (This Month)", value: Currency(20000) },
  { label: "Outstanding Invoices", value: "5" },
  { label: "Client-wise Receivables", value: Currency(5000) }
];

const getStatusStyle = (status) => {
    const statusStyles = {
      Paid: "bg-green-100 text-green-800 border border-green-200",
      Unpaid: "bg-red-100 text-red-800 border border-red-200",
      "Pending": "bg-yellow-100 text-yellow-800 border border-yellow-200",
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

export default function Payout() {
  const [emailReminder, setEmailReminder] = useState(false);
  const [smsReminder, setSmsReminder] = useState(false);

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
              <span className="text-2xl font-bold text-blue-900">{item.value}</span>
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
          // style={{ overflow: "visible" }}
          // scrollable={false}
          // columnResizeMode="expand"
          // resizableColumns
          paginator
          rows={10}
          // rowsPerPageOptions={[5, 10, 25, 50]}
        >
          {/* <Column
            field="no"
            header="No."
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
            body={(rowData, options) => options.rowIndex + 1}
          /> */}
          <Column
            field="id"
            header="Payout ID"
            bodyStyle={{
              verticalAlign: "middle",
              fontSize: "14px",
            }}
          />
          <Column
            field="driver"
            header="Driver Name & ID"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="deliveries"
            header="Number of Deliveries Completed"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="rate"
            header="Payout Rate (per Delivery)"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="payout"
            header="Total Payout"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="deduction"
            header="Deductions"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="bonus"
            header="Bonuses"
            bodyStyle={{ verticalAlign: "middle", fontSize: "14px" }}
          />
          <Column
            field="method"
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
        <InputSwitch checked={isChecked} onChange={(e) => setIsChecked(e.value)} />
      </label>
    </div>
  );
}
