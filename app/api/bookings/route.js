// bookings/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function POST(request) {
  try {
    console.log('🚀 BOOKING API HIT - POST received');

    await dbConnect();

    const body = await request.json();
    console.log('Request body:', body);

    const {
      userId,
      name,
      email,
      phone,
      session,
      date,
      arrivalTime,
      duration,
      totalAmount,
    } = body;

    if (!name || !email || !session || !date || !duration || !totalAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBooking = new Booking({
      userId: userId || 'unknown',
      name,
      email,
      phone: phone || '',
      session,
      date: new Date(date),
      arrivalTime,
      duration: Number(duration),
      totalAmount: Number(totalAmount),
    });

    await newBooking.save();

    console.log('Booking saved:', newBooking._id);

    return NextResponse.json({
      message: 'Booking saved successfully!',
      bookingId: newBooking._id
    }, { status: 201 });

  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json({
      error: 'Failed to save booking',
      details: error.message
    }, { status: 500 });
  }
}
