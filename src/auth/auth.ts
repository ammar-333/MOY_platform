export const isAuthenticated = async () => {
  return !!localStorage.getItem("authToken");
};
