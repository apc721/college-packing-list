export interface Item {
  id?: number;
  name: string;
  quantity: number | string | null;
  status: string;
  bag: number | null;
  }
  
export interface Bag {
  id?: number;
  items: string[];
  status: string;
}
