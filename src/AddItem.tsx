import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ItemStatus } from "./constant";

const Update = () => {
  const [item, setItem] = useState({
    name: '',
    quantity: 0,
    status: ItemStatus.NOT_PACKED,
    bag: 0,
  });
  const [error,setError] = useState(false)

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:8800/items`, item);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1>Add an Item</h1>
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
      <button className="button-3" onClick={handleClick}>Update</button>
      {error && "Something went wrong!"}
      <Link to="/">See all items</Link>
    </div>
  );
};

export default Update;