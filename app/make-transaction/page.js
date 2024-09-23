"use client";
import React, { useState, useEffect } from "react";
import { getAllAccounts, addMoneyToAccount, sendMoney } from "../utils/api";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";

export default function MakeTransactionPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactionType, setTransactionType] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await getAllAccounts();
      setAccounts(data.accounts);
      if (data.accounts.length > 0) {
        setSelectedAccount(data.accounts[0].accountNum);
        setSelectedAccountId(data.accounts[0].id);
        setBalance(data.accounts[0].balance);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError("Failed to fetch accounts. Please try again later.");
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await addMoneyToAccount(selectedAccountId, parseFloat(amount));
      setSuccessMessage(`Successfully deposited $${amount} to your account.`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error depositing money:", error);
      setError("Failed to deposit money. Please try again later.");
    }
  };

  const handleSendMoney = async (e) => {
    e.preventDefault();
    try {
      await sendMoney(
        selectedAccount,
        recipientAccount,
        parseFloat(amount),
        description
      );
      setSuccessMessage(
        `Successfully sent $${amount} to account ${recipientAccount}.`
      );
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error sending money:", error);
      setError("Failed to send money. Please try again later.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setAmount("");
    setDescription("");
    setRecipientAccount("");
    setTransactionType("");
    router.push("/home");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    router.push("/");
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
              fetchAccounts();
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 w-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-black">
            Welcome User
          </h2>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <div className="flex items-center w-full sm:w-auto">
              <span className="text-black mr-2">Balance:</span>
              <input
                type="text"
                value={`$${balance.toFixed(2)}`}
                readOnly
                className="border rounded px-2 py-1 text-black w-full sm:w-auto"
              />
            </div>
            <div className="flex items-center w-full sm:w-auto">
              <span className="text-black mr-2">Account Number:</span>
              <span className="text-black font-semibold">
                {selectedAccount}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 w-full sm:w-auto"
            >
              Logout
            </button>
            <button
              onClick={() => router.push("/home")}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300"
            >
              Back to Home
            </button>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-black">
            Make A Transaction
          </h3>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
            <button
              onClick={() => setTransactionType("deposit")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
            >
              Deposit In Self Account
            </button>
            <button
              onClick={() => setTransactionType("send")}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 w-full sm:w-auto"
            >
              Send Money
            </button>
          </div>

          {transactionType === "deposit" && (
            <form
              onSubmit={handleDeposit}
              className="space-y-4 border p-4 rounded-md"
            >
              <div>
                <label className="block text-sm font-medium text-black">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder="Amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder="Description"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
              >
                Deposit
              </button>
            </form>
          )}

          {transactionType === "send" && (
            <form
              onSubmit={handleSendMoney}
              className="space-y-4 border p-4 rounded-md"
            >
              <div>
                <label className="block text-sm font-medium text-black">
                  Account Number
                </label>
                <input
                  type="text"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder="Recipient Account Number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder="Amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder="Description"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300"
              >
                Send
              </button>
            </form>
          )}

          <Modal
            isOpen={showSuccessModal}
            onClose={handleCloseSuccessModal}
            title="Transaction Successful"
            message={successMessage}
          />
        </div>
      </div>
    </div>
  );
}
