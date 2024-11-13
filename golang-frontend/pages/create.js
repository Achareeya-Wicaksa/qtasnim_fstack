import { useState } from 'react';
import { createItem } from '../lib/api';

export default function CreateItem() {
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [sold, setSold] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      stock,
      sold,
      transaction_date: transactionDate,
      category,
    };
    await createItem(data);
    alert('Item created successfully!');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Create Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded-md w-full"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="p-2 border rounded-md w-full"
        />
        <input
          type="number"
          placeholder="Sold"
          value={sold}
          onChange={(e) => setSold(e.target.value)}
          className="p-2 border rounded-md w-full"
        />
        <input
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          className="p-2 border rounded-md w-full"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded-md w-full"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded-md">
          Create Item
        </button>
      </form>
    </div>
  );
}
