import React, { useState, useEffect } from "react";
import { Item } from "../types";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Item) => void;
  item: Item | null; 
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState<Item>({
    id: 0,
    name: "",
    stock: 0,
    sold: 0,
    transaction_date: "", 
    category: "",
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      const today = new Date().toISOString(); 
      setFormData({
        id: 0,
        name: "",
        stock: 0,
        sold: 0,
        transaction_date: today, 
        category: "",
      });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{item ? "Edit Item" : "Create New Item"}</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <input
            type="number"
            name="sold"
            placeholder="Sold"
            value={formData.sold}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />

          
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
