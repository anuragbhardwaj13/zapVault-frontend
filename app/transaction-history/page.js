"use client";
import React, { useState, useEffect } from "react";
import { getTransactions, getAllAccounts } from "../utils/api";
import { useRouter } from "next/navigation";

export default function TransactionHistoryPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchTransactions();
    }
  }, [userData, page]);

  const fetchUserData = async () => {
    try {
      const data = await getAllAccounts();
      // console.log(data.accounts[0].id);

      setUserData(data);
      // console.log(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data. Please try again later.");
    }
  };

  const fetchTransactions = async () => {
    try {
      // console.log(userData);

      const response = await getTransactions(userData.accounts[0].id, page);
      setTransactions(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions. Please try again later.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    router.push("/");
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "Credit":
        return "text-green-600";
      case "Debit":
        return "text-red-600";
      default:
        return "text-black";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-6 text-center w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
          <p className="text-black">{error}</p>
          <button
            onClick={() => {
              setError(null);
              userData ? fetchTransactions() : fetchUserData();
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
        <div className="text-white text-2xl">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-semibold text-black mb-2 sm:mb-0">
              Welcome {userData.fullName}
            </h2>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
            <div className="flex items-center w-full sm:w-auto">
              <span className="mr-2 text-black">Total Balance:</span>
              <input
                type="text"
                value={`$${userData.totalBalance.toFixed(2)}`}
                readOnly
                className="border rounded px-2 py-1 w-full sm:w-auto text-black"
              />
            </div>
            <div className="w-full sm:w-auto text-right">
              <span className="mr-2 text-black">Account Number:</span>
              <span className="font-semibold text-black">
                {userData.accounts[0].accountNum}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4 text-black">
            Transaction History
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Sr No.
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction, index) => {
                  const date = new Date(transaction.createdAt);
                  return (
                    <tr key={transaction.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-black">
                        {page * 20 + index + 1}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-black">
                        {date.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-black">
                        {date.toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-black">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-black">
                        {transaction.fromAccountNum || "—"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-black">
                        {transaction.toAccountNum || "—"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-black">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-2 whitespace-nowrap text-sm font-medium ${getTransactionColor(
                          transaction.transactionType
                        )}`}
                      >
                        {transaction.transactionType}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-black">
                        {transaction.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300 disabled:bg-gray-200 disabled:text-gray-400"
            >
              Previous
            </button>
            <span className="text-sm text-black">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300 disabled:bg-gray-200 disabled:text-gray-400"
            >
              Next
            </button>
          </div>

          <button
            onClick={() => router.push("/home")}
            className="mt-6 bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
