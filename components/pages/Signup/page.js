// SignupPage.jsx
"use client";
import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeroHeader } from "@/components/Header";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";

export default function SignupPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      alert("Account created successfully! Welcome to Chill Thrive ❄️");
      setCurrentPage("Hero");
    } catch (error) {
      setErrors({ firebase: error.message });
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setErrors({});
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Signed up with Google! Welcome to Chill Thrive ❄️");
      setCurrentPage("Hero");
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        // User just closed popup, no big deal
        return;
      }
      setErrors({ firebase: error.message });
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 translate-x-1/3 translate-y-1/2 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 w-80 h-80 bg-blue-300/15 rounded-full blur-3xl" />
      </div>

      <HeroHeader setCurrentPage={setCurrentPage} />

      <main className="py-20 px-6 flex items-center justify-center min-h-screen">
        <div className="mx-auto max-w-md w-full">
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl p-10">
            <button
              onClick={() => setCurrentPage("Hero")}
              className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 transition"
              aria-label="Go back"
            >
              <ArrowLeft className="size-6 text-slate-600" />
            </button>

            <div className="text-center mb-10 pt-4">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Account</h1>
              <p className="text-slate-600">Join Chill Thrive and start recovering stronger</p>
            </div>

            {/* Google Button */}
            <Button
              onClick={handleGoogleSignup}
              disabled={loading}
              variant="outline"
              className="w-full h-12 mb-6 border-slate-300 hover:bg-slate-50"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-500">Or sign up with email</span>
              </div>
            </div>

            <form onSubmit={handleEmailSignup} className="space-y-6">
              {errors.firebase && <p className="text-sm text-red-600 text-center">{errors.firebase}</p>}

              {/* Name, Email, Password fields same as before */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} className="h-12" />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} className="h-12" />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="h-12" />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="h-12" />
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              <div className="flex justify-center items-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="cursor-pointer transition-all bg-blue-500 text-white py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                >
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
                  Create Account
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <button onClick={() => setCurrentPage("Login")} className="font-semibold text-cyan-700 hover:text-cyan-800 underline">
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}