import Restaurant from "../models/restaurant.model.js";
import { Router } from "express";

const restaurantRouter = Router();

restaurantRouter.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.aggregate([
      { $sample: { size: 100 } },
      { $sort: { Votes: -1 } },
    ]);
    if (!restaurants) {
      return res.status(404).json({ message: "No restaurants found" });
    }
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
});

restaurantRouter.get("/search/:city", async (req, res) => {
  const { city } = req.params;
  try {
    const restaurants = await Restaurant.find({ City: city }).sort({
      Votes: -1,
      "Restaurant Name": 1,
    });
    if (!restaurants) {
      return res.status(404).json({ message: "No restaurants found" });
    }
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
});

restaurantRouter.get("/search/id/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const restaurant = await Restaurant.findOne({
      "Restaurant ID": restaurantId,
    });

    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "No restaurant found with that ID" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ message: "Failed to fetch restaurant" });
  }
});

restaurantRouter.get("/cities", async (req, res) => {
  try {
    const cities = await Restaurant.distinct("City");
    if (!cities) {
      return res.status(404).json({ message: "No cities found" });
    }
    res.status(200).json({ City: cities });
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ message: "Failed to fetch cities" });
  }
});

export default restaurantRouter;
