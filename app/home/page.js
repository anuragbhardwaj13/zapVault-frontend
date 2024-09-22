"use client";
import React, { useState, useEffect } from "react";
import { getAllAccounts, createNewAccount } from "../utils/api";
import Image from "next/image";
import Logo from "../assets/file.png";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await getAllAccounts();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data. Please try again later.");
    }
  };

  const handleCreateAccount = async () => {
    try {
      await createNewAccount();
      fetchUserData();
    } catch (error) {
      console.error("Error creating new account:", error);
      setError("Failed to create a new account. Please try again later.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    router.push("/");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchUserData();
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-md mx-auto">
        <header className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={Logo}
              alt="ZapVault Logo"
              width={30}
              height={30}
              className="mr-2"
            />
            <h1 className="text-xl font-bold text-gray-800">ZapVault</h1>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-4">
              <p className="text-sm text-gray-600">
                Welcome, {userData.fullName}
              </p>
              <p className="text-xs text-gray-500">{userData.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 text-sm rounded-md hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          </div>
        </header>

        {userData.totalAccounts === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Create Account
            </h2>
            <button
              onClick={handleCreateAccount}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
            >
              Create New Account
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-lg font-semibold mb-3 text-black">
                Account Details
              </h2>
              <div className="space-y-2">
                {userData.accounts.map((account) => (
                  <div key={account.id} className="p-3 bg-gray-100 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-black">Account:</span>
                      <span className="font-semibold text-sm text-black">
                        {account.accountNum}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black">Balance:</span>
                      <span className="font-semibold text-sm text-black">
                        ${account.balance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-lg font-semibold mb-3 text-black">
                Recharge
              </h2>
              <p className="text-sm text-gray-600">Coming soon...</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-lg font-semibold mb-3 text-black">
                Movie Booking
              </h2>
              <p className="text-sm text-gray-600">Coming soon...</p>
            </div>
            <button
              onClick={() => router.push("/transaction-history")}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Transaction History
            </button>
            <button
              onClick={() => router.push("/make-transaction")}
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300"
            >
              Make a Transaction
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
