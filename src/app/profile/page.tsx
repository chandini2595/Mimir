"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    fetch("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfile(data.profile);
        else router.push("/signin");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!profile) return null;

  return (
    <div className="max-w-md mx-auto mt-12 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="mb-2"><b>Email:</b> {profile.email}</div>
      <div className="mb-2"><b>First Name:</b> {profile.given_name}</div>
      <div className="mb-2"><b>Last Name:</b> {profile.family_name}</div>
      <div className="mb-2"><b>Email Verified:</b> {profile.email_verified ? "Yes" : "No"}</div>
      <button
        onClick={handleSignOut}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}
