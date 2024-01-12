import React, { useState } from 'react';
import './App.css';
import PackingList from './PackingList';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Update from './UpdateItem';
import Add from './AddItem';
import { Bag } from './types';

function App() {
  const [bags, setBags] = useState<Bag[]>([]);
  return (
    <div className="App">
      <h1 className="App-heading">College Packing List</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PackingList bags={bags} setBags={setBags} />} />
          <Route path="/add" element={<Add />} />
          <Route path="/update/:id" element={<Update bags={bags} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
