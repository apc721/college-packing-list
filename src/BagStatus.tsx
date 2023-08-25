import React, { useEffect, useState } from 'react';
import { Bag } from './types';
import axios from 'axios';

interface BagStatusProps {
  bags: Bag[];
  deleteBag: (bagNumber: number) => void;
}

const BagStatus: React.FC<BagStatusProps> = ({ bags, deleteBag }) => {
  const [bagItemsMap, setBagItemsMap] = useState<{ [key: number]: string }>({});

  const getBagItemsByNumber = async (bagId: number) => {
    try {
      const response = await axios.get(`http://localhost:8800/items/${bagId}`);
      const bagItems = response.data.map((item: any) => item.name);
      return bagItems.join(", ");
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const fetchBagItems = async () => {
      const itemsMap: { [key: number]: string } = {};
      for (const bag of bags) {
        const items = await getBagItemsByNumber(bag.id as number);
        itemsMap[bag.id as number] = items;
      }
      setBagItemsMap(itemsMap);
    };
    fetchBagItems();
  }, [bags]);

  return (
    <div>
      <h2>Bag Status</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Items</th>
            <th>Status</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {bags.map((bag, index) => (
            <tr key={index}>
              <td>{bag.id}</td>
              <td>{bagItemsMap[bag.id as number]}</td>
              <td>
                <span className={`status-icon ${
                  bag.status.includes("Not Packed")
                    ? "red"
                    : bag.status.includes("In bag")
                    ? "orange"
                    : bag.status.includes("In car")
                    ? "yellow"
                    : bag.status.includes("Unpacked")
                    ? "green"
                    : ""
                  }`}
                >
                  {bag.status}
                </span>
              </td>
              <td>
                <button className="button-3" role="button" onClick={() => deleteBag(bag.id as number)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BagStatus;
