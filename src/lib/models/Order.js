import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  orderId:       { type: String, required: true, unique: true },
  customer:      { type: String, required: true },
  phone:         { type: String, default: null },
  fromLocation:  { type: String, required: true },
  toLocation:    { type: String, required: true },
  service:       { type: String, required: true },
  status:        { type: String, default: 'Pending' },
  amount:        { type: String, required: true },
  date:          { type: String },
  customerEmail: { type: String, default: null },
  description:   { type: String, default: null },
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)