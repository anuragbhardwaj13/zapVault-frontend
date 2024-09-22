// app/utils/api.js

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://13.51.231.112/api/v1";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
};

export const fetchData = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response;
};

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("authToken");
  }
  return null;
};

const authenticatedFetch = async (endpoint, options = {}) => {
  const authToken = getAuthToken();
  if (!authToken) {
    throw new Error("Not authenticated");
  }
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${authToken}`,
  };
  return fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
};

// Auth endpoints
export const initiateSignup = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response;
};

export const completeSignup = async (email, verificationCode) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, verificationCode }),
  });
  const data = await handleResponse(response);
  if (typeof window !== "undefined") {
    sessionStorage.setItem("authToken", data.token);
  }
  return data;
};

export const signin = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await handleResponse(response);
  if (typeof window !== "undefined") {
    sessionStorage.setItem("authToken", data.token);
  }
  return data;
};

// User endpoints
export const getCurrentUserId = async () => {
  const response = await authenticatedFetch("/user/id");
  return handleResponse(response);
};

export const getAllAccounts = async () => {
  const response = await authenticatedFetch("/user/all-accounts");

  return handleResponse(response);
};

// Account endpoints
export const createNewAccount = async () => {
  const response = await authenticatedFetch("/account/create-new", {
    method: "GET",
  });
  return handleResponse(response);
};

export const addMoneyToAccount = async (accountId, amount) => {
  const response = await authenticatedFetch(`/account/${accountId}/add-money`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  return handleResponse(response);
};

export const sendMoney = async (
  fromAccountNum,
  toAccountNum,
  amount,
  description
) => {
  const response = await authenticatedFetch(
    `/account/${fromAccountNum}/send-money`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toAccountNum, amount, description }),
    }
  );
  return handleResponse(response);
};

export const getTransactions = async (accountId, page = 0, size = 10) => {
  const response = await authenticatedFetch(
    `/account/${accountId}/transactions?page=${page}&size=${size}`
  );
  return handleResponse(response);
};
