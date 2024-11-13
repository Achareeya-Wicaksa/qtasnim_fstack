import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 10000, // Set timeout to 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchItems = async () => {
  try {
    const response = await api.get('/items');
    console.log(response.data); // log the response
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
};


export const createItem = async (data: any) => {
  const response = await api.post("/items", data);
  return response.data;
};

export const updateItem = async (id: number, data: any) => {
  const response = await api.put(`/items/${id}`, data);
  return response.data;
};

export const deleteItem = async (id: number) => {
  const response = await api.delete(`/items/${id}`);
  return response.data;
};
