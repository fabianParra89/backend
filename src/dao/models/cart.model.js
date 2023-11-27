import mongoose from "mongoose";

const prodcutItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  }, { _id: false });
 
const CartSchema = new mongoose.Schema({
    products: {type: [prodcutItemSchema], default: []}
}, {timestamps: true});


 
export default mongoose.model('Cart', CartSchema);