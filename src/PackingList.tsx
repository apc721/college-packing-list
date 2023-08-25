import React, { useEffect, useState } from 'react';
import BagStatus from './BagStatus';
import { Item, Bag } from './types';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface PackingListProps {
  bags: Bag[];
  setBags: React.Dispatch<React.SetStateAction<Bag[]>>; 
}

const PackingList: React.FC<PackingListProps> = ({bags, setBags}) => {
  const [items, setItems] = useState<Item[]>([]);

  // fetch all items
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await axios.get('http://localhost:8800/items');
        setItems(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllItems();
  }, []);

  // fetch all bags
  useEffect(() => {
    const fetchAllBags = async () => {
      try {
        const response = await axios.get('http://localhost:8800/bags');
        setBags(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBags();
  }, []);

  const addBag = async (e: any) => {
    console.log("Bag click");
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8800/bags`, { items: null, status: "Not Packed" });
      window.location.reload()
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBag = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8800/bags/${id}`);
      const itemsWithBagNumber = items.filter((item) => item.bag === id);
      itemsWithBagNumber.forEach(async (item) => {
        await axios.put(`http://localhost:8800/items/${item.id}`, { ...item, bag: 0, status: "Not Packed" });
      });
      window.location.reload()
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Packing List for College</h2>
      <div className='button-management'>
        <button className="button-3" role="button"><Link to={`/add`}>Add Item</Link></button>
        <button className="button-3" role="button" onClick={addBag}>Add Bag</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>
              <span className={`status-icon ${
                  item.status.includes("Not Packed")
                    ? "red"
                    : item.status.includes("In Bag")
                    ? "orange"
                    : item.status.includes("In Car")
                    ? "yellow"
                    : item.status.includes("Unpacked")
                    ? "green"
                    : ""
                  }`}
                >{item.status}</span>
              </td>
              <td>
                <button className="button-3" role="button"><Link to={`/update/${item.id}`}>Update</Link></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <BagStatus bags={bags} deleteBag={deleteBag} />
      </div>
    </div>
  );
};

export default PackingList;