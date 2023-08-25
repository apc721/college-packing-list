import React, { useEffect } from 'react';
import { Bag } from './types';
import axios from 'axios';

interface BagStatusProps {
  bags: Bag[];
  deleteBag: (bagNumber: number) => void;
}

const BagStatus: React.FC<BagStatusProps> = ({ bags, deleteBag }) => {

  const getBagItemsByNumber = (bags: Bag[], bagId: number) => {
    const bag = bags.find((bag) => bag.id === bagId);
    return bag ? bag.items : [];
  }

  const displayBagItems = (bags: Bag[], bagId: number) => {
    const bagItems = getBagItemsByNumber(bags, bagId);
    return (bagItems) ? bagItems.sort().join(', ') : '';
  }

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
              <td>{displayBagItems(bags, bag.id as number)}</td>
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
