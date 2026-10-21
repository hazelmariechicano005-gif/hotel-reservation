const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

let product = [
  { id: 1, room: "room01", price: "150" },
  { id: 2, room: "roomB10", price: "170" },
  { id: 3, room: "roomC12", price: "120" }, // Na-update mula Bike
  { id: 4, room: "roomD14", price: "90" }, // Na-update mula Bike
];

let nextId = 5;

app.get("/api/product", (req, res) => {
  res.json(product);
});

app.post("/api/product", (req, res) => {
  const { room, price } = req.body;

  if (!room || price === undefined || price === "") {
    return res.status(400).json({
      message: "Room and price are required.",
    });
  }

  const newProduct = {
    id: nextId++,
    room,
    price: String(price),
  };

  product.push(newProduct);

  console.log("ADD:", { room: newProduct.room, price: newProduct.price });

  res.status(201).json(newProduct);
});

// EDIT: Update an existing room
app.put("/api/product/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = product.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Room not found." });
  }

  const { room, price } = req.body;

  if (!room || price === undefined || price === "") {
    return res.status(400).json({ message: "Room and price are required." });
  }

  product[index] = { ...product[index], room, price: String(price) };

  console.log("EDIT:", {
    room: product[index].room,
    price: product[index].price,
  });

  res.json(product[index]);
});

app.delete("/api/product/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = product.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Room not found." });
  }

  product.splice(index, 1);

  console.log("DELETE:", id);

  res.json({ message: "Room deleted successfully." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
