import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchItems = async () => {
  try {
    const response = await api.get('/items');
    console.log('response.data'); 
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};


export const createItem = async (data: any) => {
  try {
    if (data.stock) {
      data.stock = Number(data.stock); 
    }

    if (data.sold) {
      data.sold = Number(data.sold); 
    }

    if (data.transaction_date) {
      const date = new Date(data.transaction_date);
      data.transaction_date = date.toISOString(); 
    }

    const response = await api.post("/items", data);

    console.log("Response received:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Error in createItem:", error.response?.data || error.message || error);
    throw error;
  }
};



export const updateItem = async (id: number, data: any) => {
  try {
    const updatedData = {
      ...data,
      stock: typeof data.stock === 'string' ? parseInt(data.stock, 10) : data.stock,
      sold: typeof data.sold === 'string' ? parseInt(data.sold, 10) : data.sold,
    };

    console.log("Sending data:", JSON.stringify(updatedData)); 

    const response = await api.put(`/items/${id}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in updateItem:", error.response?.data || error.message || error);
    throw error;
  }
};


export const deleteItem = async (id: number) => {
  const response = await api.delete(`/items/${id}`);
  return response.data;
};
