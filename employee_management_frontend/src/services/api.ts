import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; // تأكد من أن هذا هو الـ API الصحيح

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/token/`, { email, password });
    return response.data; // يحتوي على access و refresh tokens
  } catch (error) {
    throw error;
  }
};
