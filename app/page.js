"use client";

import { useState, useEffect } from "react";
import { initiateSignup, signin, completeSignup } from "./utils/api";
import Modal from "./components/Modal";
import Image from "next/image";
import Logo from "./assets/file.png";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    phone: "",
    email: "",
    governmentId: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      router.push("/home");
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateFields = (fields) => {
    const emptyFields = fields.filter((field) => !formData[field]);
    if (emptyFields.length > 0) {
      openModal(
        "Error",
        `All fields are required. Please fill in: ${emptyFields.join(", ")}.`
      );
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateFields(["username", "password"])) return;

    try {
      setIsLoading(true);
      const data = await signin({
        identifier: formData.username,
        password: formData.password,
      });
      sessionStorage.setItem("authToken", data.token);
      setIsAuthenticated(true);
      router.push("/home");
    } catch (error) {
      console.error("Sign in error:", error);
      openModal("Error", "Failed to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (
      !validateFields([
        "fullName",
        "username",
        "phone",
        "email",
        "governmentId",
        "password",
      ])
    )
      return;

    try {
      setIsLoading(true);
      await initiateSignup(formData);
      openModal(
        "Success",
        "Registration initiated! Check your email for a verification code."
      );
      setIsVerifying(true);
    } catch (error) {
      console.error("Registration error:", error);
      openModal("Error", "Failed to register.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!verificationCode) {
      openModal("Error", "Please enter the verification code.");
      return;
    }

    try {
      setIsLoading(true);
      const data = await completeSignup(formData.email, verificationCode);
      sessionStorage.setItem("authToken", data.token);
      setIsAuthenticated(true);
      router.push("/home");
    } catch (error) {
      console.error("Verification error:", error);
      openModal("Error", "Failed to verify.");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (title, message) => {
    setModalContent({ title, message });
    setModalOpen(true);
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* ... (rest of the component remains the same) ... */}
        <div className="bg-gray-100 p-6 text-center">
          <Image
            src={Logo}
            alt="ZapVault Logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ZapVault</h1>
          <p className="text-sm text-gray-600 mb-4">Secure. Fast. Reliable.</p>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 text-sm">
            <p className="font-bold">DISCLAIMER:</p>
            <p>
              This is not an actual banking product. ZapVault is an educational
              project to understand Spring Boot Microservice Architecture.
            </p>
          </div>
        </div>

        <div className="p-6">
          {!isRegistering ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Sign In
              </h2>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 text-black mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 mb-6 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSignIn}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Sign In
              </button>
              <p className="text-sm text-center mt-6 text-gray-600">
                New User?{" "}
                <span
                  onClick={() => setIsRegistering(true)}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Register Now
                </span>
              </p>
            </>
          ) : isVerifying ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Verify Email
              </h2>
              <input
                type="text"
                name="verificationCode"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-3 mb-6 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleVerification}
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300"
              >
                Verify
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Register
              </h2>
              {[
                "fullName",
                "username",
                "phone",
                "email",
                "governmentId",
                "password",
                "confirmPassword",
              ].map((field) => (
                <input
                  key={field}
                  type={
                    field.includes("password") || field.includes("Password")
                      ? "password"
                      : "text"
                  }
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-3 mb-4 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
              <button
                onClick={handleRegister}
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300"
              >
                Register
              </button>
              <p className="text-sm text-center mt-6 text-gray-600">
                Already Registered?{" "}
                <span
                  onClick={() => setIsRegistering(false)}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Sign In
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
      />

      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-800">
              {isVerifying ? "Verifying..." : "Processing..."}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {isVerifying
                ? "Please wait while we verify your account."
                : "Please wait while we process your request."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
