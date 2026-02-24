import axios from "axios";
import type { AuthResponse } from "../Types/signup_types";

export async function register(data: FormData): Promise<AuthResponse> {
  console.log(data);
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
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

// export async function login(data: LoginData): Promise<AuthResponse> {
//   const res = await axios.post(``, body, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   return res.json();
// }
