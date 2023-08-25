import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Eagles711!',
  database: 'test',
});

app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  res.json("Hello this is the backend!");
});

app.get("/items", (req, res) => {
  const query = "SELECT * FROM items";
  db.query(query, (err, data) => {
    if (err) {
      return res.json({error: err});
    }
    return res.json(data);
  });
});

app.get("/items/:id", (req, res) => {
  const query = "SELECT name FROM items where bag = ?";
  const values = [req.params.id];
  db.query(query, values, (err, data) => {
    if (err) {
      return res.json({error: err});
    }
    return res.json(data);
  });
});

app.post("/items", (req, res) => {
  console.log('test 123');
  const query = "INSERT INTO items (name, quantity, status, bag) VALUES (?, ?, ?, ?)";
  const values = [req.body.name, req.body.quantity, req.body.status, req.body.bag];

  db.query(query, values, (err, data) => {
    if (err) {
      return res.json({error: err});
    }
    return res.json("Item has been added successfully!");
  });
});

app.delete("/items/:id", (req, res) => {
  const itemId = req.params.id;
  const query = "DELETE FROM items WHERE id = ?";

  db.query(query, [itemId], (err, data) => {
    if (err) {
      return res.json({error: err});
    }
    return res.json("Item has been deleted successfully!");
  });
});

app.put("/items/:id", (req, res) => {
  const itemId = req.params.id;
  const query = "UPDATE items SET name = ?, quantity = ?, status = ?, bag = ? WHERE id = ?";
  const values = [req.body.name, req.body.quantity, req.body.status, req.body.bag];

  db.query(query, [...values, itemId], (err, data) => {
    if (err) {
      return res.json({error: err});
    }
    return res.json("Item has been updated successfully!");
  });
});

// BAG ROUTES

app.get("/bags", (req, res) => {
  const query = "SELECT * FROM bags";
  db.query(query, (err, data) => {
    if (err) {
      return res.json({error: err});
    }
    return res.json(data);
  });
});

app.post("/bags", (req, res) => {
  const query = "INSERT INTO bags (items, status) VALUES (?, ?)";
  const values = [req.body.items, req.body.status];

  db.query(query, values, (err, data) => {
    if (err) {
      return res.json({error: err});
    }
    return res.json("Bag has been added successfully!");
  });
});

app.delete("/bags/:id", (req, res) => {
  const bagId = req.params.id;
  const query = "DELETE FROM bags WHERE id = ?";

  db.query(query, [bagId], (err, data) => {
    if (err) {
      return res.json({error: err});
    }
    return res.json("Bag has been deleted successfully!");
  });
});

app.put("/bags/:id", (req, res) => {
  const bagId = req.params.id;
  const query = "UPDATE bags SET items = ?, status = ?, WHERE id = ?";
  const values = [req.body.items, req.body.status];

  db.query(query, [...values, bagId], (err, data) => {
    if (err) {
      return res.json({error: err});
    }
    return res.json("Bag has been updated successfully!");
  });
});

app.listen(8800, () => {
  console.log('Connected to backend!');
});
