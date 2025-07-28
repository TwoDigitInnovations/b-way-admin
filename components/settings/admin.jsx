import { InputSwitch } from 'primereact/inputswitch';
import React from 'react'

export default function Admin() {
  return (
   <div className="bg-white shadow-sm border border-gray-200 p-4 mb-4 lg:mb-6 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Settings</h2>
        <form>
          {/* Name, Email, Phone */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-xs text-gray-500 mb-2">Name</label>
              <input
                type="text"
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                placeholder="Name"
              />
            </div>
            <div>
              <label for="user-email" className="block text-xs text-gray-500 mb-2">Email</label>
              <input
                type="text"
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                placeholder="Email"
                autocomplete="off"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">Phone</label>
              <input
                type="tel"
                className="w-full rounded border px-3 py-2 text-sm text-black border-gray-200 h-10"
                placeholder="Phone"
              />
            </div>
          </div>

          {/* Notifications & Alerts */}
          <h3 className="font-semibold text-gray-800 mb-2">
            Notifications & Alerts
          </h3>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-2 mb-6">
            <ToggleField
              label="Email Notifications"
              sub="Receive updates about your account and shipments via email."
            />
            <ToggleField
              label="SMS Alerts"
              sub="Get immediate alerts for critical events via SMS."
            />
          </div>

          {/* Compliance */}
          <h3 className="font-semibold text-gray-800 mb-2">Compliance</h3>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-2 mb-6">
            <ToggleField
              label="HIPAA Logging"
              sub="Enable logging for HIPAA compliance."
            />
            <ToggleField
              label="Driver Certification Requirement"
              sub="Require drivers to be certified before accepting shipments."
            />
          </div>

          {/* Integrations */}
          <h3 className="font-semibold text-gray-800 mt-6 mb-2">
            Integrations
          </h3>
          <div className="grid grid-cols-3 gap-6 mb-7">
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                Stripe API Key
              </label>
              <input
                type="password"
                className="w-full rounded border bg-gray-100 px-3 py-2 text-sm text-black border-gray-200"
                placeholder="*****"
                autocomplete="off"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                AWS Access Key ID
              </label>
              <input
                type="password"
                className="w-full rounded border bg-gray-100 px-3 py-2 text-sm text-black border-gray-200"
                placeholder="*****"
                autocomplete="off"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                AWS Secret Access Key
              </label>
              <input
                type="password"
                className="w-full rounded border bg-gray-100 px-3 py-2 text-sm text-black border-gray-200"
                placeholder="*****"
                autocomplete="off"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                Mapbox API Key
              </label>
              <input
                type="password"
                className="w-full rounded border bg-gray-100 px-3 py-2 text-sm text-black border-gray-200"
                placeholder="*****"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-secondary hover:bg-secondary text-white font-semibold px-6 py-2 rounded"
          >
            Save Changes
          </button>
        </form>
      </div>
  )
}

function ToggleField({ label, sub }) {
  const [checked, setChecked] = React.useState(false);
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-2">
      <div>
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <span className="block text-xs text-gray-400">{sub}</span>
      </div>
      <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
    </div>
  );
}