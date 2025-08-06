import React, { useState, useMemo } from "react";
import { AutoComplete } from "primereact/autocomplete";

export default function Dropdown({ data, value, selected, changed }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);

  const items = useMemo(
    () =>
      data.map((item) => ({
        label: `${item.name}`,
        value: item._id,
        fullData: item,
      })),
    [data]
  );

  const searchItems = (event) => {
    const query = event.query.toLowerCase();
    const _filteredItems = items.filter((item) =>
      item.label.toLowerCase().includes(query)
    );
    setFilteredItems(_filteredItems);
  };

  return (
    <AutoComplete
      value={value}
      suggestions={filteredItems}
      completeMethod={searchItems}
    //   virtualScrollerOptions={{ itemSize: 38 }}
      field="label"
      dropdown
      onChange={(e) => {
        changed(e.value);
      }}
      onSelect={(e) => {
        selected(e.value);
      }}
      placeholder="Select or type item"
      inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md h-10 focus:outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500 !text-sm text-gray-700"
      className="w-full"
      panelClassName="border border-gray-300 rounded-md shadow-lg bg-white max-h-64 overflow-y-auto"
    />
  );
}
