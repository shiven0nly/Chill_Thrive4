import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },     
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  session: { type: String, required: true },
  date: { type: Date, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: Number, required: true },   // hours
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);