/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { AuthResponse } from "../Types/signup_types";

export async function register(data: FormData): Promise<any> {
  try {
    const res = await axios.post(
      "http://10.0.82.105:1125/api/Registration/Registration",
      data,
      {
        headers: {
          "X-API-KEY": "k9F8v2xY!tG7#QpR6sL4mB0wZ1uX3eJd",
        },
      },
    );

    console.log("Registration successful:", res.data);
    return res.data;
  } catch (error: any) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
}

export async function login(data: FormData): Promise<AuthResponse> {
  try {
    const res = await axios.post(
      "http://10.0.82.105:1125/api/Login/login",
      data,
      {
        headers: {
          "X-API-KEY": "k9F8v2xY!tG7#QpR6sL4mB0wZ1uX3eJd",
        },
      },
    );

    console.log("Login successful:", res.data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }

    throw "Unexpected error";
  }
}

export async function GovLogin(data: FormData): Promise<AuthResponse> {
  try {
    const res = await axios.post(
      "http://10.0.82.105:1125/api/Login/login",
      data,
      {
        headers: {
          "X-API-KEY": "k9F8v2xY!tG7#QpR6sL4mB0wZ1uX3eJd",
        },
      },
    );

    console.log("Login successful:", res.data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }

    throw "Unexpected error";
  }
}
