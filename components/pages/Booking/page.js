"use client";

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { HeroHeader } from '@/components/Header';
import { CheckCircle, ArrowLeft, Home, Loader2, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import Contact from '@/components/Footer';

export default function BookingPage({ setCurrentPage }) {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({ name: '', email: '', phone: '' });
  const [date, setDate] = useState(null);
  const [session, setSession] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [duration, setDuration] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Pricing
  const pricing = {
    'Ice Bath': 50,
    'Steam Bath': 45,
    'Jacuzzi': 50,
    'Ice Bath + Steam': 80,
    'Ice Bath + Jacuzzi': 85,
    'Full Recovery Combo': 120,
  };

  const totalAmount = pricing[session] * (duration || 0);

  // Validation
  const isStep1Valid = details.name.trim() && details.email.trim() && details.phone.trim();
  const isStep2Valid = date && session;
  const isStep3Valid = arrivalTime && duration;

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);

      if (currentUser) {
        setDetails(prev => ({
          ...prev,
          name: currentUser.displayName || prev.name || '',
          email: currentUser.email || prev.email || '',
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNext = () => {
    if (step === 1 && !isStep1Valid) return;
    if (step === 2 && !isStep2Valid) return;
    if (step === 3 && !isStep3Valid) return;
    if (step < 4) setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleConfirm = async () => {
    if (!user) {
      alert('Please log in to confirm your booking');
      setCurrentPage('Login');
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const token = await getIdToken(user);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: details.name,
          email: details.email,
          phone: details.phone,
          session,
          date: date.toISOString(),
          arrivalTime,
          duration: Number(duration),
          totalAmount,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save booking');
      }

      setConfirmed(true);
    } catch (err) {
      setSaveError(err.message);
      console.error('Booking save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `
CHILL THRIVE - BOOKING CONFIRMATION
====================================
Customer: ${details.name}
Email: ${details.email}
Phone: ${details.phone}
Session: ${session}
Date: ${date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Arrival Time: ${arrivalTime}
Duration: ${duration} hour${duration > 1 ? 's' : ''}
Total Paid: $${totalAmount}
Thank you for trusting Chill Thrive with your recovery.
Recover stronger. Thrive faster.
Confirmed on: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChillThrive_Booking_${details.name.replace(/\s+/g, '_')}_${date?.toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const goHome = () => setCurrentPage('Hero');

  // Loading auth
  if (loadingAuth) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-700 mx-auto" />
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in → prompt
  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 translate-x-1/3 translate-y-1/2 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 w-80 h-80 bg-blue-300/15 rounded-full blur-3xl" />
        </div>

        <HeroHeader setCurrentPage={setCurrentPage} />

        <main className="py-16 px-6 flex items-center justify-center min-h-screen">
          <div className="mx-auto max-w-md text-center">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl p-12">
              <LogIn className="mx-auto size-20 text-cyan-700 mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Log in to Book</h2>
              <p className="text-slate-600 mb-10">
                You need to be signed in to book a recovery session.
              </p>

              <div className="space-y-4">
                <Button
                  size="lg"
                  onClick={() => setCurrentPage('Login')}
                  className="w-full py-6 text-lg cursor-pointer transition-all bg-blue-500 text-white rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:bg-blue-500 cursor-pointer"
                >
                  Log In
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setCurrentPage('Signup')}
                  className="w-full py-6 text-lg border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-50 rounded-xl cursor-pointer"
                >
                  Create Account
                </Button>
              </div>

              <button
                onClick={goHome}
                className="mt-8 text-cyan-700 hover:text-cyan-800 underline flex items-center gap-2 mx-auto cursor-pointer"
              >
                <ArrowLeft className="size-5" />
                Back to Home
              </button>
            </div>
          </div>
        </main>

        <Contact />
      </div>
    );
  }

  // Main booking UI
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 translate-x-1/3 translate-y-1/2 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 w-80 h-80 bg-blue-300/15 rounded-full blur-3xl" />
      </div>

      <HeroHeader setCurrentPage={setCurrentPage} />

      <main className="py-16 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3, 4].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex flex-col items-center ${step >= s ? 'text-cyan-700' : 'text-slate-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm border-2 ${step >= s ? 'bg-cyan-700 text-white border-cyan-700' : 'border-slate-300'}`}>
                    {s}
                  </div>
                  <span className="mt-2 text-xs font-medium hidden sm:block">
                    {['Details', 'Date & Session', 'Time & Duration', 'Confirm'][s - 1]}
                  </span>
                </div>
                {i < 3 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-cyan-700' : 'bg-slate-300'}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            {step > 1 && !confirmed && (
              <button
                onClick={handleBack}
                className="absolute top-6 left-6 z-10 p-3 rounded-full hover:bg-slate-100 transition-all duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="size-6 text-slate-600" />
              </button>
            )}

            <div className="p-8 pt-16 pb-10">
              {!confirmed ? (
                <>
                  {step === 1 && (
                    <div className="space-y-7">
                      <h2 className="text-2xl font-semibold text-center text-slate-900">Your Details</h2>
                      <p className="text-center text-sm text-slate-500">Logged in as <strong>{user.email}</strong></p>
                      <div className="space-y-5">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" placeholder="John Doe" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} className="mt-2 h-12" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={details.email} disabled className="mt-2 h-12 bg-slate-50" />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} className="mt-2 h-12" />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-7">
                      <h2 className="text-2xl font-semibold text-center text-slate-900">Choose Date & Session</h2>
                      <div className="flex justify-center mb-6">
                        <Calendar mode="single" selected={date} onSelect={setDate} disabled={{ before: new Date() }} className="rounded-md border shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="session-type">Session Type</Label>
                        <Select value={session} onValueChange={setSession}>
                          <SelectTrigger id="session-type" className="w-full h-12 bg-white border-slate-300 hover:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600 transition-all">
                            <SelectValue placeholder="Select your recovery session" />
                          </SelectTrigger>
                          <SelectContent side="bottom" className="bg-white border border-slate-200 shadow-xl rounded-lg z-50">
                            <SelectItem value="Ice Bath">Ice Bath ($50/hr)</SelectItem>
                            <SelectItem value="Steam Bath">Steam Bath ($45/hr)</SelectItem>
                            <SelectItem value="Jacuzzi">Jacuzzi ($50/hr)</SelectItem>
                            <SelectItem value="Ice Bath + Steam" className="font-medium">Ice Bath + Steam Combo ($80)</SelectItem>
                            <SelectItem value="Ice Bath + Jacuzzi" className="font-medium">Ice Bath + Jacuzzi Combo ($85)</SelectItem>
                            <SelectItem value="Full Recovery Combo" className="font-bold">Full Recovery Combo ($120) — Best Value</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-7">
                      <h2 className="text-2xl font-semibold text-center text-slate-900">Arrival & Duration</h2>
                      <div className="space-y-5">
                        <div>
                          <Label htmlFor="time">Preferred Arrival Time</Label>
                          <Input id="time" type="time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} className="mt-2 h-12 bg-white border-slate-300 hover:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600 transition-all" />
                        </div>
                        <div>
                          <Label htmlFor="duration">Session Duration</Label>
                          <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger id="duration" className="w-full h-12 mt-2 bg-white border-slate-300 hover:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600 transition-all">
                              <SelectValue placeholder="How long would you like?" />
                            </SelectTrigger>
                            <SelectContent side="bottom" className="bg-white border border-slate-200 shadow-xl rounded-lg z-50">
                              <SelectItem value="1">1 Hour</SelectItem>
                              <SelectItem value="2">2 Hours</SelectItem>
                              <SelectItem value="3">3 Hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-7 text-center">
                      <h2 className="text-2xl font-semibold text-slate-900">Confirm Your Booking</h2>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 space-y-4 text-left border border-cyan-200">
                        <p><strong>Name:</strong> {details.name}</p>
                        <p><strong>Email:</strong> {details.email}</p>
                        <p><strong>Session:</strong> <span className="text-cyan-700 font-semibold">{session}</span></p>
                        <p><strong>Date:</strong> {date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <p><strong>Arrival:</strong> {arrivalTime || 'Flexible'}</p>
                        <p><strong>Duration:</strong> {duration} hour{duration > 1 && 's'}</p>
                        <div className="pt-4 border-t border-cyan-200">
                          <p className="text-3xl font-bold text-cyan-700">Total: ${totalAmount}</p>
                        </div>
                      </div>

                      {saveError && <p className="text-red-600 text-center mt-6">{saveError}</p>}
                    </div>
                  )}

                  {(step <= 4) && (
                    <div className="mt-10 flex justify-end">
                      <Button
                        size="lg"
                        className="cursor-pointer transition-all bg-blue-500 text-white py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:bg-blue-500"
                        onClick={step === 4 ? handleConfirm : handleNext}
                        disabled={
                          saving ||
                          (step === 1 && !isStep1Valid) ||
                          (step === 2 && !isStep2Valid) ||
                          (step === 3 && !isStep3Valid)
                        }
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          step === 4 ? 'Confirm Booking' : 'Next →'
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 space-y-10">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                    <CheckCircle className="mx-auto size-32 text-green-600" />
                  </motion.div>
                  <h2 className="text-4xl font-bold text-slate-900">Booking Confirmed!</h2>
                  <p className="text-lg text-slate-600 max-w-md mx-auto">
                    Your <strong>{session}</strong> session is booked and saved to your account!
                  </p>

                  <div className="space-y-6">
                    <Button
                      size="lg"
                      className="px-10 py-6 text-lg font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                      onClick={handleDownloadReceipt}
                    >
                      Download Receipt
                    </Button>

                    <Button
                      size="lg"
                      variant="outline"
                      className="px-10 py-6 text-lg font-medium border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-50 rounded-xl flex items-center gap-3 mx-auto"
                      onClick={goHome}
                    >
                      <Home className="size-6" />
                      Go Home
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Contact />
    </div>
  );
}