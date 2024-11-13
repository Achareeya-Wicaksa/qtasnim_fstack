// types/index.d.ts
export interface Item {
    id: number;
    name: string;
    stock: number;
    sold: number;
    transaction_date: string;  // Or Date if you want to use JavaScript Date objects
    category: string;
  }
  