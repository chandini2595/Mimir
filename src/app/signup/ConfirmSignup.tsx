"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmSignup({ email }: { email: string }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter the confirmation code");
      return;
    }
    
    setError("");
    setSuccess(false);
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: code.trim() }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/signin"), 2000);
      } else {
        setError(data.error || "Confirmation failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const resendCode = async () => {
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
      } else {
        setError(data.error || "Failed to resend code");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-xl font-bold mb-4">Confirm Your Account</h2>
      <div className="mb-4 text-gray-600">
        A confirmation code was sent to <b>{email}</b>. Please check your email and enter the code below.
      </div>
      
      <form onSubmit={handleConfirm}>        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-4 text-center text-lg font-mono tracking-widest"
          placeholder="000000"
          value={code}
          onChange={e => {
            // Only allow digits and limit to 6 characters
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setCode(value);
          }}
          maxLength={6}
          required
          disabled={loading}
        />
        
        {error && (
          <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
          {success && (
          <div className="text-green-600 mb-4 p-2 bg-green-50 rounded">
            {code ? "Account confirmed! Redirecting to sign in..." : "Confirmation code resent! Check your email."}
          </div>
        )}
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-3"
          disabled={loading}
        >
          {loading ? "Confirming..." : "Confirm Account"}
        </button>
      </form>
        <div className="text-center">
        <button 
          onClick={resendCode}
          className="text-blue-600 hover:underline text-sm disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Sending..." : "Didn't receive code? Resend"}
        </button>
      </div>
    </div>
  );
}
