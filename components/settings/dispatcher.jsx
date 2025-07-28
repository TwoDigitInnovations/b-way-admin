import { ChevronRightIcon, MenuIcon, Plus } from "lucide-react";
import { InputSwitch } from "primereact/inputswitch";
import React, { useState } from "react";

export default function Dispatcher() {
  const [orderPriority, setOrderPriority] = useState(false);
  const [splitBy, setSplitBy] = useState("");
  const [alerts, setAlerts] = useState({
    email: false,
    sms: false,
    push: false,
  });
  const [etaAlerts, setEtaAlerts] = useState(false);
  const [slaAlerts, setSlaAlerts] = useState(false);
  const [liveTraffic, setLiveTraffic] = useState(false);
  const [routePref, setRoutePref] = useState("fastest");
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [perDriver, setPerDriver] = useState("");
  const [activeZone, setActiveZone] = useState("NJ");

  const invoices = [
    { center: "Warehouse A", amount: 500, date: "2024-01-15" },
    { center: "Warehouse B", amount: 750, date: "2024-02-20" },
    { center: "Warehouse C", amount: 800, date: "2024-03-25" },
  ];

  return (
    <section className="bg-white shadow-sm border border-gray-200 p-4 mb-4 lg:mb-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-5 text-blue-900">
        Order Settings
      </h2>
      {/* Priority & Split */}
      <div className="flex items-center mb-4">
        <span className="mr-1 text-lg font-bold text-black">
          Order Priority
        </span>
        <ChevronRightIcon className="w-4 h-4 text-black" />
      </div>
      <div className="mb-6 grid items-center">
        <span className="text-base font-semibold text-gray-800">
          Auto-Split Orders
        </span>
        <span className="text-sm text-gray-500">
          Automatically split orders based on capacity or zone
        </span>
        <div className="flex gap-3 items-center mt-2">
          <button
            type="button"
            className={
              "px-4 py-2 rounded border text-sm text-black border-gray-200 font-semibold " +
              (splitBy === "capacity" ? "bg-blue-600 text-white" : "bg-white")
            }
            onClick={() => setSplitBy("capacity")}
          >
            Split by Capacity
          </button>
          <button
            type="button"
            className={
              "px-4 py-2 rounded border text-sm text-black border-gray-300 font-semibold " +
              (splitBy === "zone" ? "bg-blue-600 text-white" : "bg-white")
            }
            onClick={() => setSplitBy("zone")}
          >
            Split by Zone
          </button>
        </div>
      </div>
      {/* Alerts */}
      <div className="border border-gray-300 rounded-lg p-4 mb-6">
        <span className="text-base block mb-2 font-semibold text-blue-900">
          Alerts
        </span>
        <div className="flex flex-col gap-6 items-left mb-2">
          {["Email", "SMS", "Push"].map((label) => (
            <label
              key={label}
              className="flex text-base text-black items-center gap-1"
            >
              <div className="checkbox-wrapper-13">
                <input
                  checked={alerts[label.toLowerCase()]}
                  onChange={() =>
                    setAlerts((prev) => ({
                      ...prev,
                      [label.toLowerCase()]: !prev[label.toLowerCase()],
                    }))
                  }
                  id="c1-13"
                  type="checkbox"
                />
                <label className="mb-1" for="c1-13">
                  {label}
                </label>
              </div>
            </label>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-8 items-center">
          <ToggleField label="ETA Alerts" />
          <ToggleField label="SL Alerts" />
        </div>
      </div>
      {/* Map & Routing */}
      <div className="mb-6">
        <span className="block text-lg mb-1 font-semibold text-blue-900">
          Map & Routing
        </span>
        <div className="mb-2">
          <span className="block text-sm mb-1 text-gray-500">Map Provider</span>
          <div className="w-64 h-24 bg-gray-200 rounded" />
        </div>
        <span className="flex mb-2 gap-1 items-center text-base font-semibold text-gray-800">
            Live Traffic Data
          </span>
        <div className="flex items-center gap-4 mb-2">
          
          <button
            type="button"
            className={
              "px-4 py-2 rounded border text-sm text-black border-gray-200 font-semibold " +
              (routePref === "fastest" ? "bg-blue-600 text-white" : "bg-white")
            }
            onClick={() => setRoutePref("fastest")}
          >
            Fastest
          </button>
          <button
            type="button"
            className={
              "px-4 py-2 rounded border text-sm text-black border-gray-200 font-semibold " +
              (routePref === "shortest" ? "bg-blue-600 text-white" : "bg-white")
            }
            onClick={() => setRoutePref("shortest")}
          >
            Shortest
          </button>
          <button
            type="button"
            className={
              "px-4 py-2 rounded border text-sm text-black border-gray-200 font-semibold " +
              (routePref === "avoidTolls"
                ? "bg-blue-600 text-white"
                : "bg-white")
            }
            onClick={() => setRoutePref("avoidTolls")}
          >
            Avoid Tolls
          </button>
        </div>
      </div>
      {/* Driver & Zone Rules */}
      <div className="mb-6">
        <span className="block mb-2 font-semibold text-blue-900">
          Driver & Zone Rules
        </span>
        <div className="flex gap-1 mb-2">
          {["NJ", "NY", "CT"].map((zone) => (
            <button
              key={zone}
              className={
                "px-3 py-1 rounded font-medium !text-sm " +
                (activeZone === zone
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-700")
              }
              onClick={() => setActiveZone(zone)}
            >
              {zone}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-black text-base font-semibold">Auto-Optimize Routes</span>
        </div>
        <div className="mt-2">
          <label className="block text-sm text-gray-500 mb-1">
            Max Deliveries per Driver
          </label>
          <input
            type="number"
            placeholder="Enter number"
            className="border rounded px-3 py-1 text-sm w-48 text-black h-10"
            value={perDriver}
            onChange={(e) => setPerDriver(e.target.value)}
          />
        </div>
      </div>
      {/* Invoice Management */}
      <div>
        <span className="block mb-2 font-semibold text-blue-900">
          Invoice Management
        </span>
      <table className="min-w-full bg-white mb-3 border border-gray-200 !rounded">
          <thead>
            <tr className="text-blue-900 text-xs font-semibold border-b border-gray-200">
              <th className="py-2 px-3 text-left">Center</th>
              <th className="py-2 px-3 text-left">Amount</th>
              <th className="py-2 px-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((item) => (
              <tr key={item.center} className="text-sm hover:bg-gray-50">
                <td className="py-2 px-3 text-black">{item.center}</td>
                <td className="py-2 px-3 text-black">${item.amount}</td>
                <td className="py-2 px-3 text-black">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col w-48 gap-4 my-4">
          <button className="bg-secondary hover:bg-secondary text-white font-semibold px-5 py-2 rounded w-42">
            <Plus className="inline-block mr-2" />
            Add Invoice
          </button>
          <button className="border bg-secondary hover:bg-secondary text-white font-semibold px-5 py-2 rounded">
            Save Settings
          </button>
        </div>
      </div>
    </section>
  );
}

function ToggleField({ label, sub }) {
  const [checked, setChecked] = React.useState(false);
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <span className="block text-xs text-gray-400">{sub}</span>
      </div>
      <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
    </div>
  );
}
