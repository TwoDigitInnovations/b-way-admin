import Layout from "@/components/layout";
import Currency from "@/helper/currency";
import { Link } from "lucide-react";
import { InputSwitch } from "primereact/inputswitch";
import React, { useState } from "react";

export default function NewInvoice() {
  const [facilityType, setFacilityType] = useState("");
  const [netTerms, setNetTerms] = useState("Standard");
  const [deliveryType, setDeliveryType] = useState("Standard");
  const [pricing, setPricing] = useState({
    base: "",
    rush: false,
    cold: false,
    returnFee: false,
    promo: "",
  });
  const [autoTotal] = useState(1250.0);

  return (
    <Layout title="Billing & Invoices">
      {/* Main Content */}
      <div className="overflow-hidden rounded-lg">
        <h1 className="text-2xl font-bold text-black mb-6">New Invoice</h1>

        {/* Client Information */}
        <section className="bg-white rounded shadow p-7 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">
            Client Information
          </h2>
          <div className="grid md:grid-cols-5 gap-4 mb-3">
            <div>
              <label className="block text-sm text-gray-800 mb-1">
                Facility Type
              </label>
              <select
                value={facilityType}
                onChange={(e) => setFacilityType(e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
              >
                <option>Select...</option>
                <option>Hospital</option>
                <option>Clinic</option>
                <option>Warehouse</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-800 mb-1">Phone</label>
              <input
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                placeholder="Enter phone"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-800 mb-1">
                Address
              </label>
              <input
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-800 mb-1">
                Contact Name
              </label>
              <input
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-800 mb-1">Email</label>
              <input
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                placeholder="Enter email"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-2">
            <button className="border border-gray-300 px-5 py-1.5 rounded font-semibold text-gray-700 hover:bg-gray-100">
              Save as Draft
            </button>
            <button className="bg-secondary text-white border-secondary px-5 py-1.5 rounded font-semibold hover:bg-secondary">
              Save as Primary Client
            </button>
          </div>
        </section>

        {/* Invoice Creation */}
        <section className="bg-white rounded shadow p-7 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">
            Invoice Creation
          </h2>
          <div className="grid md:grid-cols-4 gap-5 mb-3">
            <div>
              <label className="block text-sm text-gray-800 mb-1">
                Invoice Number
              </label>
              <input
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                placeholder="Enter invoice number"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-800 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-800 mb-1">
                Due Date
              </label>
              <input
                type="date"
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-800 mb-1">
                NET Terms
              </label>
              <select
                value={netTerms}
                onChange={(e) => setNetTerms(e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
              >
                <option>Standard</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
        </section>

        {/* Delivery & Services */}
        <section className="bg-white rounded shadow p-7 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">
            Delivery & Services
          </h2>
          <div className="grid md:grid-cols-5 gap-4 mb-3">
            <div className="col-span-5">
              <div className="md:w-4/12">
                <label className="block text-sm text-gray-800 mb-1">
                  Delivery Reference ID
                </label>
                <div className="relative">
                  <input className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10" />
                  <Link className="absolute top-3 right-2 h-4 w-4 text-gray-600" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full items-center mt-4">
                <button
                  className={`px-4 py-1 rounded border text-sm ${
                    deliveryType === "Standard"
                      ? "bg-secondary text-white border-secondary"
                      : "bg-gray-200 text-gray-800 border-gray-300"
                  }`}
                  onClick={() => setDeliveryType("Standard")}
                >
                  Standard
                </button>
                <button
                  className={`px-4 py-1 rounded border text-sm ${
                    deliveryType === "Rush"
                      ? "bg-secondary text-white border-secondary"
                      : "bg-gray-200 text-gray-800 border-gray-300"
                  }`}
                  onClick={() => setDeliveryType("Rush")}
                >
                  Rush
                </button>
                <button
                  className={`px-4 py-1 rounded border text-sm ${
                    deliveryType === "Cold Chain"
                      ? "bg-secondary text-white border-secondary"
                      : "bg-gray-200 text-gray-800 border-gray-300"
                  }`}
                  onClick={() => setDeliveryType("Cold Chain")}
                >
                  Cold Chain
                </button>
              </div>
            </div>

            <div className="flex flex-col col-span-5 md:col-span-2">
              <label className="block text-sm text-gray-800 mb-1">
                Delivery Date Range
              </label>
              <input
                type="date"
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
              />
            </div>
            <div className="flex flex-col col-span-5 md:col-span-2">
              <label className="block text-sm text-gray-800 mb-1">
                Quantity
              </label>
              <input
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                placeholder="Enter quantity"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="block text-sm text-gray-800 mb-1">
              Description
            </label>
            <textarea
              className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200"
              rows={6}
              placeholder="Description..."
            />
          </div>
        </section>

        {/* Pricing Calculator */}
        <section className="bg-white rounded shadow p-7 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">
            Pricing Calculator
          </h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="col-span-4 md:w-4/12">
              <label className="block text-sm text-gray-800 mb-1">
                Base Delivery Fee
              </label>
              <input
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                value={pricing.base}
                onChange={(e) =>
                  setPricing({ ...pricing, base: e.target.value })
                }
                placeholder="Enter amount"
              />
            </div>
            <div className="col-span-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mt-3">
                <div className="checkbox-wrapper-13 flex items-center">
                  <input
                    id="c1-13"
                    type="checkbox"
                    checked={pricing.rush}
                    onChange={(e) =>
                      setPricing({ ...pricing, rush: !pricing.rush })
                    }
                  />
                  <label className="text-black text-sm" for="c1-13">
                    Rush Fee
                  </label>
                </div>
                <div className="checkbox-wrapper-13 flex items-center">
                  <input
                    id="c1-13"
                    type="checkbox"
                    checked={pricing.cold}
                    onChange={(e) =>
                      setPricing({ ...pricing, cold: !pricing.cold })
                    }
                  />
                  <label className="text-black text-sm" for="c1-13">
                    Cold Chain Fee
                  </label>
                </div>
                <div className="checkbox-wrapper-13 flex items-center">
                  <input
                    id="c1-13"
                    type="checkbox"
                    checked={pricing.returnFee}
                    onChange={(e) =>
                      setPricing({
                        ...pricing,
                        returnFee: !pricing.returnFee,
                      })
                    }
                  />
                  <label className="text-black text-sm" for="c1-13">
                    Return Fee
                  </label>
                </div>
              </div>
            </div>
            <div className="col-span-4 mt-3 flex items-center gap-3 justify-between">
              <ToggleField label="Tax Calculation" />
            </div>
            <div className="col-span-4 mt-3 flex items-center gap-3 justify-between">
              <label className="block text-base text-gray-800 mb-1">
                Auto Total
              </label>
              <span className="text-base text-gray-700">
                {Currency(autoTotal || 0)}
              </span>
            </div>
            <div className="col-span-4 md:w-4/12">
              <label className="block text-sm text-gray-800 mb-1">
                Promo Code/Discount
              </label>
              <input
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                value={pricing.promo}
                onChange={(e) =>
                  setPricing({ ...pricing, promo: e.target.value })
                }
                placeholder="Enter code"
              />
            </div>
          </div>
        </section>

        {/* Payment & Status Manager */}
        <section className="bg-white rounded shadow p-7 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">
            Payment & Status Manager
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-800 mb-1">Status</label>
              <select className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10">
                <option>Unpaid</option>
                <option>Paid</option>
                <option>Partial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-800 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
              />
            </div>
          </div>
          <footer className="py-4">
            <h2 className="text-lg font-semibold text-black mb-4">
              Compliance Footer
            </h2>
            <div className="text-xs text-gray-500 mb-4">
              <b>Confidentiality Notice:</b> This invoice contains confidential
              information and is intended only for the recipient. Unauthorized
              disclosure is prohibited.
            </div>
            <div className="space-x-2 text-xs text-gray-500 underline">
              <span>Terms & Conditions</span>
              <span>|</span>
              <span>HIPAA Disclaimer</span>
            </div>
            <div className="h-48 w-full rounded border-2 border-dashed border-gray-200 flex justify-between mt-4">
              <div className="text-center w-full justify-center flex flex-col items-center">
                <div className="text-lg font-semibold text-gray-800 mb-1">
                  Digital Signature
                </div>
                <div className="text-sm text-gray-400 mb-1">
                  Click to add signature
                </div>
                <button className="bg-secondary px-4 py-1.5 text-white rounded font-semibold text-sm">
                  Add Signature
                </button>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </Layout>
  );
}

function ToggleField({ label, sub }) {
  const [checked, setChecked] = React.useState(false);
  return (
    <div className="w-full flex items-center justify-between">
      <div>
        <span className="block text-base font-medium text-gray-700">
          {label}
        </span>
      </div>
      <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
    </div>
  );
}
