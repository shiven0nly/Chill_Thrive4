// app/api/bookings/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';


export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const {
      name,
      email,
      phone,
      session,
      date,
      arrivalTime,
      duration,
      totalAmount,
      userId // We'll add this from frontend
    } = body;

    if (!name || !email || !session || !date || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newBooking = new Booking({
      userId: userId || 'anonymous', // fallback if not sent
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

    return NextResponse.json({
      message: 'Booking saved successfully!',
      bookingId: newBooking._id
    }, { status: 201 });

  } catch (error) {
    console.error('Booking save error:', error);
    console.log('API hit! Body:', await request.clone().json());
    return NextResponse.json({
      error: 'Failed to save booking',
      details: error.message
    }, { status: 500 });
  }
}