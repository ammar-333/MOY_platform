import { redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/auth";

export async function protectedLoader() {
  const auth = await isAuthenticated();

  if (!auth) {
    return redirect("/login");
  }

  return null;
}
