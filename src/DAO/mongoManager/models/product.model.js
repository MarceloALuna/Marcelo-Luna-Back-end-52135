import mongoose from "mongoose"

const productModel = mongoose.model('products', new mongoose.Schema({
    name: {type: String, required: true},
    img: String,
    price: Number,
    description: String,
    Stock: Number
}))

export default productModel