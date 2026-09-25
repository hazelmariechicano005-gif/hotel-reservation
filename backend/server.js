const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let product = [
    {
        room: "RoomA8",
        price: "150"
    },
    {
        room: "RoomB10",
        price: "170"
    },
    {
        room: "Bike#C67",
        price: "120"
    },
    {
        room: "Bike#D70",
        price: "90"
    }
];

app.get('/api/product', (req, res) => {
    res.json(product);
});

app.post('/api/product', (req, res) => {
    console.log(req.body);

    product.push(req.body);
    res.json(req.body);
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
}); 