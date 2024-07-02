const express = require("express");
const db = require("./config/db");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

// Route to handle order submission
app.post("/api/order/new", (req, res) => {
  // Extract order data from request body
  const { customerData, cart, startDate, endDate, reservationNumber } =
    req.body;

  // Extract relevant data from customerData and cart
  const order_id = reservationNumber;
  const user_email = customerData.email;
  const rent_start_date = startDate;
  const rent_end_date = endDate;
  const totalPrice = cart[0].totalPrice;
  const status = "Unconfirmed";

  // Prepare the database insertion query and values
  const query =
    "INSERT INTO orders (order_id, user_email, rent_start_date, rent_end_date, price, status) VALUES (?, ?, ?, ?, ?,?)";
  const values = [
    order_id,
    user_email,
    rent_start_date,
    rent_end_date,
    totalPrice,
    status,
  ];

  const id = cart[0].id;
  const orderedQuantity = cart[0].quantity;

  const carsFilePath = path.resolve(
    __dirname,
    "../assign-2/src/data/cars.json"
  );

  // Read the cars data file
  fs.readFile(carsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Error reading file" });
    }

    let cars;
    try {
      cars = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      return res.status(500).json({ error: "Error parsing JSON" });
    }

    const car = cars.find((car) => car.id === id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    if (orderedQuantity > car.quantity) {
      return res.status(400).json({
        error: `Ordered quantity exceeds available quantity: ${car.quantity}`,
      });
    }

    // Only insert into database if ordered quantity is less than or equal to available quantity
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting order:", err);
        return res.status(500).json({ error: "Error inserting order" });
      }
      res.status(201).json({ message: "Order added successfully" });
    });
  });
});

app.post("/api/order/confirm", (req, res) => {
  const { reservationNumber, cart } = req.body;

  // Check if the request body contains the necessary data
  if (
    !reservationNumber ||
    !cart ||
    !Array.isArray(cart) ||
    cart.length === 0
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const id = cart[0].id;
  const orderedQuantity = cart[0].quantity;

  const carsFilePath = path.resolve(
    __dirname,
    "../assign-2/src/data/cars.json"
  );

  // Read the cars data file
  fs.readFile(carsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Error reading file" });
    }

    let cars;
    try {
      cars = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      return res.status(500).json({ error: "Error parsing JSON" });
    }

    const car = cars.find((car) => car.id === id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    // if (orderedQuantity > car.quantity) {
    //   return res.status(400).json({
    //     error: `Ordered quantity exceeds available quantity: ${car.quantity}`,
    //   });
    // }

    // Update quantity and availability
    car.quantity -= orderedQuantity;
    car.availability = car.quantity > 0;

    // Ensure quantity doesn't become negative
    if (car.quantity < 0) {
      car.quantity = 0;
    }

    // Write the updated data back to the file
    fs.writeFile(carsFilePath, JSON.stringify(cars, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing file:", writeErr);
        return res.status(500).json({ error: "Error updating file" });
      }

      // Only update the order status if the inventory update was successful
      const query = "UPDATE orders SET status = ? WHERE order_id = ?";
      const values = ["Confirmed", reservationNumber];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Error confirming order:", err);
          return res.status(500).json({ error: "Error confirming order" });
        }

        res
          .status(200)
          .json({ message: "Order confirmed and inventory updated" });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
