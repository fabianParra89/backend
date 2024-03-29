import mongoose, { Schema } from 'mongoose';

const cartSubSchema = new mongoose.Schema({
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }
}, { _id: false });


const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, },
  email: { type: String, required: true, unique: true },
  password: { type: String, },
  role: { type: String, default: 'user', enum: ['user', 'admin', 'premium'] },
  cartId: {type: [cartSubSchema], default: []},
  documents: [  { name: String, reference: String  }],
  // documents: {type: [  { name: String, reference: String  }], default: []},
  age: { type: Number, required: false },
  last_connection: { type: Date },
}, { timestamps: true });

export default mongoose.model('User', userSchema);