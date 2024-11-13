// pages/index.tsx
import React from "react";
import ItemList from "../components/ItemList";

const Home = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center p-6">Item Transactions</h1>
      <ItemList />
    </div>
  );
};

export default Home;
