import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    category: {
        type: String,
        enum: [
            "Clothing",
            "Footwear",
            "Accessories",
            "Jewelry",
            "Bags",
            "Beauty",
            "Electronics",
            "Food",
            "Others",
        ],
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    size: [{
        type: String
    }],
    color: {
        type: String
    },
    description: {
        type: String
    },
    rating: {
     average: { type: Number, default: 0 },
     count: { type: Number, default: 0 }
    }
}, { timestamps: true })

const Item=mongoose.model("Item",itemSchema)
export default Item