import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  "Restaurant ID": { type: Number },
  "Restaurant Name": { type: String },
  "Country Code": { type: Number },
  City: { type: String },
  Address: { type: String },
  Locality: { type: String },
  "Locality Verbose": { type: String },
  Longitude: { type: Number },
  Latitude: { type: Number },
  Cuisines: { type: String },
  "Average Cost for two": { type: Number },
  Currency: { type: String },
  "Has Table booking": { type: String },
  "Has Online delivery": { type: String },
  "Is delivering now": { type: String },
  "Switch to order menu": { type: String },
  "Price range": { type: Number },
  "Aggregate rating": { type: Number },
  "Rating color": { type: String },
  "Rating text": { type: String },
  Votes: { type: Number },
});

const Restaurant = mongoose.model(
  "Restaurant",
  restaurantSchema,
  "restaurants"
);

export default Restaurant;
