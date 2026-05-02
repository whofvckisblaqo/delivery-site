import mongoose from 'mongoose'

const TrackingSchema = new mongoose.Schema({
  orderId:       { type: String, required: true, unique: true },
  customer:      { type: String, required: true },
  customerEmail: { type: String, default: null },
  fromLocation:  { type: String, required: true },
  toLocation:    { type: String, required: true },
  status:        { type: String, default: 'Pending' },
  estimate:      { type: String, default: null },
  driver:        { type: String, default: null },
  steps:         { type: Array, default: [] },
}, { timestamps: true })

export default mongoose.models.Tracking || mongoose.model('Tracking', TrackingSchema)