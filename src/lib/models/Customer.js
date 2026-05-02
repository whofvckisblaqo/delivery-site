import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  phone:      { type: String, default: null },
  city:       { type: String, default: null },
  orders:     { type: Number, default: 0 },
  spent:      { type: String, default: '$0.00' },
  joined:     { type: String },
  status:     { type: String, default: 'Active' },
}, { timestamps: true })

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema)