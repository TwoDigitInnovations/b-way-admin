import Layout from "@/components/layout";
import Admin from "@/components/settings/admin";
import Dispatcher from "@/components/settings/dispatcher";
import { InputSwitch } from "primereact/inputswitch";
import React from "react";

export default function SettingsPage({ user }) {
  return (
    <Layout title="Settings">
      {user?.role === "ADMIN" ? (
        <Admin />
      ) : user?.role === "DISTRIBUTER" ? (
        <Distibuter />
      ) : user?.role === "DISPATCHER" ? (
        <Dispatcher />
      ) : user?.role === "DRIVER" ? (
        <Driver />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-700">
            Settings not available for your role
          </h1>
        </div>
      )}
    </Layout>
  );
}

// Toggle field component for reusability
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
