import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./database/mongodb.js";
import restaurantRouter from "./routes/restaurant.route.js";

configDotenv();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

connectDB();

app.use("/api/restaurants", restaurantRouter);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Zomoto API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
