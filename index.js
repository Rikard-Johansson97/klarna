import express from "express";
import { createOrder, retrieveOrder } from "./klarna.js";
const app = express();
import { config } from "dotenv";
config();

const products = [
  { id: "1", price: 53, name: "House" },
  { id: "2", price: 12, name: "table" },
  { id: "3", price: 43, name: "chair" },
];

app.get("/", (req, res) => {
  res.send(
    products
      .map((product) => {
        return `<a href="/p/${product.id}">${product.name}</a>`;
      })
      .join("")
  );
});

app.get("/p/:id", async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const id = req.params.id;

    const product = products.find((product) => product.id === id);

    if (!product) {
      throw new Error();
    }
    const data = await createOrder(product);
    // Send the product in the response
    console.log(data);
    res.send(data.html_snippet);
  } catch (error) {
    // If an error occurred, send a 404 response with an error message
    return res.status(404).send({
      message: "Product not found",
    });
  }
});

app.get("/confirmation/", async (req, res) => {
  const data = await retrieveOrder(req.query.order_id);
  res.send(data.html_snippet);
});

app.listen(3000);
