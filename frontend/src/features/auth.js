import api from "@/api";

export const fetchMeApi = async () => {
  const response = await api.get("/api/auth/me");
  return response.data.user;
};

export const loginApi = async (token) => {
  // Obtain CSRF token
  const csrfResponse = await api.get("/api/auth/csrf-token");
  const csrfToken = csrfResponse.data.csrfToken;

  // Authenticate with Firebase ID token
  const response = await api.post(
    "/api/auth/login",
    { token },
    {
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    }
  );

  return response.data;
};

export const logoutApi = async () => {
  const csrfResponse = await api.get("/api/auth/csrf-token");
  const csrfToken = csrfResponse.data.csrfToken;

  const response = await api.post(
    "/api/auth/logout",
    {},
    {
      headers: {
        "X-CSRF-Token": csrfToken,
      },
    }
  );

  return response.data;
};