const axios = require("axios");

const nibbsApi = axios.create({
  baseURL: process.env.NIBSS_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.NIBSS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

const nibssAccountCreation = async (payload) => {
  try {
    const response = await nibbsApi.post(`/api/account/create`, payload);
    return response.data;
  } catch (error) {
    console.log("nibss created", error.response);
    throw error.response.data;
  }
};

const nibssBvnCreation = async (payload) => {
  try {
    const response = await nibbsApi.post(`/api/insertBvn`, payload);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const nibssBvnValidation = async (payload) => {
  try {
    const response = await nibbsApi.post(`/api/validateBvn`, payload);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const nibssNinCreation = async (payload) => {
  try {
    const response = await nibbsApi.post(`/api/insertNin`, payload);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const nibssNinValidation = async (payload) => {
  try {
    const response = await nibbsApi.post(`/api/validateNin`, payload);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const nibssAcctNameEnquiry = async (accountNumber) => {
  try {
    const response = await nibbsApi.get(
      `/api/account/name-enquiry/${accountNumber}`,
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const nibssBankTransfer = async (payload) => {
  try {
    const response = await nibbsApi.post(`/api/transfer`, payload);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const nibssGetAcctBalance = async (accountNumber) => {
  try {
    const response = await nibbsApi.get(
      `/api/account/balance/${accountNumber}`,
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const nibssTransactionById = async (tnxId) => {
  try {
    const response = await nibbsApi.get(`/api/transaction/${tnxId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const nibssGetAllBankAccounts = async () => {
  try {
    const response = await nibbsApi.get(`/api/accounts`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

module.exports = {
  nibssAccountCreation,
  nibssBvnCreation,
  nibssBvnValidation,
  nibssNinCreation,
  nibssNinValidation,
  nibssAcctNameEnquiry,
  nibssBankTransfer,
  nibssGetAcctBalance,
  nibssTransactionById,
  nibssGetAllBankAccounts,
};
