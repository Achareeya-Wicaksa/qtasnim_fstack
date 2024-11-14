import React, { useState, useEffect } from "react";
import { fetchItems, deleteItem, createItem, updateItem } from "../lib/api"; // Assuming you have these functions in API
import { Item } from "../types";
import Modal from "./Modal";

const ItemList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "transaction_date" | "newest" | "oldest">("name");
  const [filterDate, setFilterDate] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for delete confirmation modal
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null); // Store item to be deleted

  useEffect(() => {
    const getItems = async () => {
      setIsLoading(true);
      try {
        const data = await fetchItems();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getItems();
  }, []);

  const handleDelete = async (id: number) => {
    if (itemToDelete) {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setShowDeleteModal(false); // Close delete modal
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentItem(null);
    setShowModal(true);
  };

  const openEditModal = (item: Item) => {
    setIsEditMode(true);
    setCurrentItem(item);
    setShowModal(true);
  };

  const openDeleteModal = (item: Item) => {
    setItemToDelete(item); // Set item to be deleted
    setShowDeleteModal(true); // Open delete confirmation modal
  };

  const handleSave = async (item: Item) => {
    if (isEditMode && currentItem) {
      await updateItem(currentItem.id, item);
      setItems((prev) =>
        prev.map((itm) => (itm.id === currentItem.id ? item : itm))
      );
    } else {
      const newItem = await createItem(item);
      setItems((prev) => [...prev, newItem]);
    }
    setShowModal(false);
  };

  const filteredItems = items
    .filter((item) => {
      if (searchTerm) {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter((item) => {
      if (filterDate.start && filterDate.end) {
        const date = new Date(item.transaction_date);
        const startDate = new Date(filterDate.start);
        const endDate = new Date(filterDate.end);
        return date >= startDate && date <= endDate;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "newest") {
        return new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
      } else {
        return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
      }
    });

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="border px-4 py-2 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <select
            onChange={(e) =>
              setSortBy(e.target.value as "name" | "transaction_date" | "newest" | "oldest")
            }
            className="border px-4 py-2 rounded-lg bg-white"
          >
            <option value="name">Sort by Name</option>
{/*         <option value="transaction_date">Sort by Date</option>
 */}        <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>
        </div>
        <div>
          <input
            type="date"
            className="border px-4 py-2 rounded-lg"
            onChange={(e) =>
              setFilterDate((prev) => ({ ...prev, start: e.target.value }))
            }
            value={filterDate.start}
          />
          <input
            type="date"
            className="border px-4 py-2 rounded-lg ml-2"
            onChange={(e) =>
              setFilterDate((prev) => ({ ...prev, end: e.target.value }))
            }
            value={filterDate.end}
          />
        </div>
        <button
          onClick={openCreateModal}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          + Add Item
        </button>
      </div>

      <table className="table-auto w-full border-collapse shadow-lg rounded-lg">
        <thead>
          <tr className="bg-blue-200 text-left">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Stock</th>
            <th className="border px-4 py-2">Sold</th>
            <th className="border px-4 py-2">Transaction Date</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50">
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.stock}</td>
                <td className="border px-4 py-2">{item.sold}</td>
                <td className="border px-4 py-2">
                  {new Date(item.transaction_date).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{item.category}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(item)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center border px-4 py-2">
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        item={isEditMode ? currentItem : null}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete Item</h2>
            <p>Are you sure you want to delete "{itemToDelete.name}"?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(itemToDelete.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;
