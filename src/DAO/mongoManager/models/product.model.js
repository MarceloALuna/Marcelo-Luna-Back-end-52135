import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true },
  image: {
    type: String,
    required: true},
  price: {
    type: Number,
    required: true},
  description: { 
    type: String, 
    required: true },
  Stock: {
    type: Number,
    required: true},
  code: {
      type: String,
      required: true,
      unique: true},
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
