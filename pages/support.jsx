import React, { useState } from "react";
import { Search, Calendar, ChevronDown, ChevronUp, Download } from "lucide-react";
import Layout from "@/components/layout";

const requestTypes = ["Reissue Request", "Refund Request", "VIP Request", "Void Request"];
const reissueReasons = ["Voluntary Reissue", "Involuntary Reissue", "Schedule Change", "Other"];
const faqs = [
  {
    q: "How do tickets get issued?",
    a: "To issue a ticket, go to the booking search, make a booking, fill out the passenger information, and create a PNR. Then click to order ticket.",
  },
  {
    q: "What is the process refund tickets?",
    a: "Refund requests can be made from the support ticket section. Select 'Refund Request' and fill in the required details.",
  },
  {
    q: "How can I reissue the tickets?",
    a: "Choose 'Reissue Request' in the support form, provide the PNR and reason, and submit your request.",
  },
  {
    q: "How can see ticket history by PNR?",
    a: "Use the search bar in the support history section to filter by PNR.",
  },
  {
    q: "How can see ticket usage?",
    a: "Ticket usage can be tracked in the 'Manage Air' or 'Statements' section.",
  },
];
const ticketHistory = [
  {
    no: "SR#136534276",
    type: "Refund Request",
    date: "20/01/2023",
    status: "Inprocess",
  },
  {
    no: "SR#136534745",
    type: "Reissue Request",
    date: "25/01/2023",
    status: "Approve",
  },
  {
    no: "SR#136534787",
    type: "VIP Request",
    date: "23/01/2023",
    status: "Submit",
  },
  {
    no: "SR#136534732",
    type: "Void Request",
    date: "23/01/2023",
    status: "Cancel",
  },
];
const statusColor = {
  Inprocess: "text-yellow-600 bg-yellow-100",
  Approve: "text-green-700 bg-green-100",
  Submit: "text-blue-700 bg-blue-100",
  Cancel: "text-red-700 bg-red-100",
};

export default function Support() {
  const [form, setForm] = useState({
    requestType: "",
    pnr: "",
    passenger: "",
    ticketNo: "",
    reissueReason: "",
    changeDate: "",
    flightNo: "",
    remarks: "",
  });
  const [faqOpen, setFaqOpen] = useState(null);

  return (
    <Layout title="Support Ticket">
      <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Support Ticket</h1>
          <p className="text-gray-500 mb-8">When customers have problems, they open support tickets.</p>

          {/* Create New Ticket */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Create New Ticket</h2>
            <p className="text-gray-500 mb-4 text-sm">Fill up all the information here, then click submit button</p>
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Select Request Type *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                  value={form.requestType}
                  onChange={e => setForm(f => ({ ...f, requestType: e.target.value }))}
                >
                  <option value="">Select</option>
                  {requestTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col relative">
                <label className="text-sm font-medium text-gray-700 mb-1">Search PNR</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 pr-8"
                  value={form.pnr}
                  onChange={e => setForm(f => ({ ...f, pnr: e.target.value }))}
                  placeholder="02AUGFD"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-8" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Passenger Name</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  value={form.passenger}
                  onChange={e => setForm(f => ({ ...f, passenger: e.target.value }))}
                  placeholder="Mark Andarson"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Ticket Number</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  value={form.ticketNo}
                  onChange={e => setForm(f => ({ ...f, ticketNo: e.target.value }))}
                  placeholder="996502333736727"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Choose Reissue Reason</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                  value={form.reissueReason}
                  onChange={e => setForm(f => ({ ...f, reissueReason: e.target.value }))}
                >
                  <option value="">Select</option>
                  {reissueReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col relative">
                <label className="text-sm font-medium text-gray-700 mb-1">Change Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 pr-8"
                  value={form.changeDate}
                  onChange={e => setForm(f => ({ ...f, changeDate: e.target.value }))}
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-8" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Flight No</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  value={form.flightNo}
                  onChange={e => setForm(f => ({ ...f, flightNo: e.target.value }))}
                  placeholder="BG602"
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  value={form.remarks}
                  onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
                  placeholder="Write your remarks"
                />
              </div>
              <div className="flex items-end md:col-span-2">
                <button
                  type="button"
                  className="bg-[#003C72] hover:bg-[#003C72] text-white font-medium px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors w-full md:w-auto"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>

          {/* Latest Support History & FAQ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Support History */}
            <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Latest Support History</h2>
                <button className="flex items-center gap-1 text-[#003C72] hover:underline text-sm font-medium">
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="py-2 px-2 text-left font-medium">Support Req No</th>
                      <th className="py-2 px-2 text-left font-medium">Request Type</th>
                      <th className="py-2 px-2 text-left font-medium">Request Date</th>
                      <th className="py-2 px-2 text-left font-medium">Support Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticketHistory.map((t) => (
                      <tr key={t.no} className="border-b last:border-b-0">
                        <td className="py-2 px-2 font-mono text-gray-700">{t.no}</td>
                        <td className="py-2 px-2 text-gray-700">{t.type}</td>
                        <td className="py-2 px-2 text-gray-700">{t.date}</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor[t.status]}`}>{t.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <div className="divide-y divide-gray-200">
                {faqs.map((faq, idx) => (
                  <div key={faq.q}>
                    <button
                      className="w-full flex justify-between items-center py-3 text-left focus:outline-none"
                      onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                    >
                      <span className="font-medium text-gray-700">{faq.q}</span>
                      {faqOpen === idx ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {faqOpen === idx && (
                      <div className="py-2 text-gray-600 text-sm animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 