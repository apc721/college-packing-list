import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ItemStatus } from "./constant";
import { Bag, Item } from "./types";

interface UpdateItemProps {
  bags: Bag[];
}

const UpdateItem: React.FC<UpdateItemProps> = ({bags}) => {
  const [item, setItem] = useState<Item>({
    name: '',
    quantity: 0,
    status: ItemStatus.NOT_PACKED,
    bag: 0 ,
  });
  const [error,setError] = useState(false);
  const [selectedBagNumber, setSelectedBagNumber] = useState<number>((item.bag) ? item.bag : 0);

  const location = useLocation();
  const navigate = useNavigate();

  const itemId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await axios.get('http://localhost:8800/items');
        setItem(response.data.filter((item: any) => item.id == itemId)[0]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllItems();
  }, []);

  useEffect(() => {
    setSelectedBagNumber((item.bag) ? item.bag : 0);
  }, [item]);

  const handleChange = (e: any) => {
    setItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e: any) => {
    e.preventDefault();
    const oldBagNumber = item.bag;
    const isRemovedFromBag = (selectedBagNumber === 0 && oldBagNumber !== 0);
    const isNewBag = (selectedBagNumber !== oldBagNumber && !isRemovedFromBag);
    const newItem = {
      name: item.name,
      quantity: item.quantity,
      status: item.status,
      bag: item.bag,
    };
    console.log(isNewBag, isRemovedFromBag);
    if (isRemovedFromBag) {
      newItem.status = ItemStatus.NOT_PACKED;
      newItem.bag = 0;
      // remove item from bag.items
      const oldBag = bags.find((bag) => bag.id === oldBagNumber);
      if (oldBag && oldBag.items) {
        const newItems = oldBag.items.filter((itemId) => itemId as unknown as number !== item.id);
        await axios.put(`http://localhost:8800/bags/${oldBagNumber}`, { ...oldBag, items: newItems });
      }
    }
    if (isNewBag) {
      newItem.status = ItemStatus.IN_BAG + " #" + selectedBagNumber;
      newItem.bag = selectedBagNumber;
      // add item to bag.items
      const newBag = bags.find((bag) => bag.id === selectedBagNumber);
      console.log(newBag);
      if (newBag) {
        if (newBag.items == undefined) {
          newBag.items = [];
        }
        newBag.items.push(item.name);
        await axios.put(`http://localhost:8800/bags/${selectedBagNumber}`, newBag);
      }
    }
    try {
      await axios.put(`http://localhost:8800/items/${itemId}`, newItem);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  const resetItem = async (id: number) => {
    try {
      await axios.put(`http://localhost:8800/items/${id}`, { ...item, quantity: 0, status: ItemStatus.NOT_PACKED, bag: null });
      window.location.reload()
    } catch (err) {
      console.log(err);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8800/items/${id}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form">
      <h1>Update the Item</h1>
      <input
        type="text"
        value={item.name}
        placeholder="Item name"
        name="name"
        onChange={handleChange}
      />
      <input
        type="number"
        value={(item.quantity) ? item.quantity : ""}
        placeholder="Quantity"
        name="quantity"
        onChange={handleChange}
      />
      <input
        disabled
        type="text"
        value={item.status}
        placeholder="Status"
        name="status"
        onChange={handleChange}
      />
       <select
          value={selectedBagNumber}
          onChange={(e) => setSelectedBagNumber(parseInt(e.target.value))}
          name="bag"
        >
          <option value={0}>Select Bag</option>
          {bags.map((bag) => (
            // if bag.id matches selectedBagNumber, set selected attribute to true
            <option key={bag.id} value={bag.id}>
              Bag #{bag.id}
            </option>
          ))}
        </select>
      <div className="button-management">
        <button className="button-3" onClick={handleClick}>Update</button>
        <button style={{backgroundColor: 'gray'}} className="button-3" onClick={() => resetItem(item.id as unknown as number)}>Reset</button>
        <button style={{backgroundColor: 'red'}} className="button-3" onClick={() => deleteItem(item.id as unknown as number)}>Delete</button>
        {error && "Something went wrong!"}
      </div>
      <Link style={{color: "black"}} to="/">See all items</Link>
    </div>
  );
};

export default UpdateItem;