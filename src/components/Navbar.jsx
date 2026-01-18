"use client";
import { AuthContext } from "@/context/AuthProvider";
import Link from "next/link";
import { useContext } from "react";


export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="navbar bg-base-100 shadow">
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold">Care.xyz</Link>
      </div>
      <div className="flex gap-3">
        <Link href="/services" className="btn btn-ghost">Services</Link>

        {user ? (
          <>
            <Link href="/my-bookings" className="btn btn-ghost">My Bookings</Link>
            <button onClick={logout} className="btn btn-error btn-sm">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-primary btn-sm">Login</Link>
            <Link href="/register" className="btn btn-outline btn-sm">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
