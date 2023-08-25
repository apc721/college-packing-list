import React, { useState } from 'react';
import { Item, Bag } from './types';

interface BagManagementProps {
  bags: Bag[];
  items: Item[];
  createBag: () => void;
  assignItemToBag: (index: number, itemName: string, bagNumber: number) => void;
}

const BagManagement: React.FC<BagManagementProps> = ({ bags, items, createBag, assignItemToBag }) => {
  const [selectedBag, setSelectedBag] = useState<number | undefined>(undefined);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);

  const handleBagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBag(parseInt(event.target.value));
  };

  const handleItemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem(event.target.value);
    setSelectedItemIndex(event.target.accessKey as unknown as number);
  };

  const assignItem = () => {
    if (selectedBag !== undefined && selectedItem !== '') {
      // if selectedItemId is not in the selected bag's items, assign it
      const selectedBagItems = (bags.find((bag) => bag.id === selectedBag) as Bag).items;
      if (!selectedBagItems.includes(selectedItem)) {
        assignItemToBag(selectedItemIndex, selectedItem, selectedBag);
        setSelectedBag(undefined);
        setSelectedItem('');
        setSelectedItemIndex(0);
      }
    }
  };

  return (
    <div>
      <h2>Bag Management</h2>
      <div>
        <button style={{ marginBottom: '5px' }} className="button-3" role="button" onClick={createBag}>Create Bag</button>
      </div>
      <div>
        <select value={selectedBag || ''} onChange={handleBagChange}>
          <option value="">Select Bag</option>
          {bags.map((bag) => (
            <option key={bag.id} value={bag.id}>
              Bag #{bag.id}
            </option>
          ))}
        </select>
        <select value={selectedItem} onChange={handleItemChange}>
          <option value="">Select Item</option>
          {items.map((item, i) => (
            <option key={i} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <button style={{ marginLeft: '5px' }} className="button-3" role="button" onClick={assignItem}>Assign Item</button>
      </div>
    </div>
  );
};

export default BagManagement;
