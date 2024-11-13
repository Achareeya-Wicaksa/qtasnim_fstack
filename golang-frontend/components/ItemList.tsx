import React, { useState, useEffect } from "react";
import { fetchItems, deleteItem } from "../lib/api";
import { Item } from "../types";
import Modal from "./Modal";

const ItemList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "transaction_date">("name");
  const [filterDate, setFilterDate] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const getItems = async () => {
      const data = await fetchItems();
      setItems(data);
    };

    getItems();
  }, []);

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteItem(deleteId);
      setItems((prev) => prev.filter((item) => item.id !== deleteId));
      setShowModal(false);
    }
  };

  const filteredItems = items
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) => {
      const date = new Date(item.transaction_date);
      const startDate = new Date(filterDate.start);
      const endDate = new Date(filterDate.end);
      return date >= startDate && date <= endDate;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
      }
    });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="border px-4 py-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <select
            onChange={(e) => setSortBy(e.target.value as "name" | "transaction_date")}
            className="border px-4 py-2 rounded"
          >
            <option value="name">Sort by Name</option>
            <option value="transaction_date">Sort by Date</option>
          </select>
        </div>
        <div>
          <input
            type="date"
            className="border px-4 py-2 rounded"
            onChange={(e) => setFilterDate((prev) => ({ ...prev, start: e.target.value }))}
            value={filterDate.start}
          />
          <input
            type="date"
            className="border px-4 py-2 rounded ml-2"
            onChange={(e) => setFilterDate((prev) => ({ ...prev, end: e.target.value }))}
            value={filterDate.end}
          />
        </div>
      </div>

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Stock</th>
            <th className="border px-4 py-2">Sold</th>
            <th className="border px-4 py-2">Transaction Date</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.stock}</td>
              <td className="border px-4 py-2">{item.sold}</td>
              <td className="border px-4 py-2">{new Date(item.transaction_date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{item.category}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setDeleteId(item.id);
                    setShowModal(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} onDelete={handleDelete} />
    </div>
  );
};

export default ItemList;
