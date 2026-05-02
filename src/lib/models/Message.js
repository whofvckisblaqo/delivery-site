import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String, default: null },
  subject:   { type: String, default: null },
  message:   { type: String, required: true },
  read:      { type: Boolean, default: false },
  time:      { type: String },
}, { timestamps: true })

export default mongoose.models.Message || mongoose.model('Message', MessageSchema)