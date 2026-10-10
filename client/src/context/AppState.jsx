import { useCallback, useMemo, useState } from "react";
import AppContext from "./AppContext.jsx";

const DEFAULT_API_URL = "http://localhost:3000";

function AppState({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("orbithire_token") || "",
  );
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orbithire_user") || "null");
    } catch {
      return null;
    }
  });

  const request = useCallback(
    async (path, options = {}) => {
      const base = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(
        /\/$/,
        "",
      );
      const headers = new Headers(options.headers || {});
      const isForm = options.body instanceof FormData;
      if (!isForm && options.body !== undefined)
        headers.set("Content-Type", "application/json");
      const activeToken = localStorage.getItem("orbithire_token") || token;
      if (activeToken && options.auth !== false)
        headers.set("Auth", activeToken);

      const response = await fetch(`${base}${path}`, { ...options, headers });
      const type = response.headers.get("content-type") || "";
      const payload = type.includes("application/json")
        ? await response.json()
        : await response.text();
      if (
        !response.ok ||
        payload?.message === "First Login" ||
        payload?.message === "user not found "
      ) {
        if (response.status === 401 && options.auth !== false) {
          localStorage.removeItem("orbithire_token");
          localStorage.removeItem("orbithire_user");
          setToken("");
          setUser(null);
        }
        const message =
          payload?.message ||
          payload?.error ||
          `Request failed (${response.status})`;
        throw new Error(message);
      }
      return payload;
    },
    [token],
  );

  const login = useCallback(
    async (credentials) => {
      const result = await request("/api/user/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify(credentials),
      });
      if (!result?.token)
        throw new Error(
          result?.message || "Login response did not contain a token.",
        );
      const safeUser = result.user
        ? Object.fromEntries(
            Object.entries(result.user).filter(([key]) => key !== "password"),
          )
        : null;
      setToken(result.token);
      setUser(safeUser);
      localStorage.setItem("orbithire_token", result.token);
      localStorage.setItem("orbithire_user", JSON.stringify(safeUser));
      return { ...result, user: safeUser };
    },
    [request],
  );

  const register = useCallback(
    async (details) => {
      return request("/api/user/register", {
        method: "POST",
        auth: false,
        body: JSON.stringify(details),
      });
    },
    [request],
  );

  const logout = useCallback(() => {
    setToken("");
    setUser(null);
    localStorage.removeItem("orbithire_token");
    localStorage.removeItem("orbithire_user");
  }, []);

  const api = useMemo(
    () => ({
      baseURL: import.meta.env.VITE_API_URL || DEFAULT_API_URL,
      token,
      user,
      isAuthenticated: Boolean(token),
      request,
      login,
      register,
      logout,
      jobs: {
        list: () => request("/api/job/all"),
        byId: (id) => request(`/api/job/${id}`),
        create: (data) =>
          request("/api/job", { method: "POST", body: JSON.stringify(data) }),
        update: (id, data) =>
          request(`/api/job/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
          }),
        remove: (id) => request(`/api/job/${id}`, { method: "DELETE" }),
      },
      candidate: {
        profile: () => request("/api/candidate/profile"),
        savedJobs: () => request("/api/candidate/saved-jobs"),
        toggleSavedJob: (jobId) =>
          request(`/api/candidate/saved-jobs/${jobId}`, { method: "PATCH" }),
        create: (data) =>
          request("/api/candidate/create", {
            method: "POST",
            body: JSON.stringify(data),
          }),
        update: (id, data) =>
          request(`/api/candidate/${id || user?._id}`, {
            method: "PUT",
            body: JSON.stringify(data),
          }),
      },
      recruiter: {
        profile: () => request("/api/recruiter/"),
        create: (data) =>
          request("/api/recruiter/create", {
            method: "POST",
            body: JSON.stringify(data),
          }),
        update: (id, data) =>
          request(`/api/recruiter/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
          }),
      },
      applications: {
        mine: () => request("/api/application/"),
        recruiter: () => request("/api/application/recruiter/all"),
        apply: (data) =>
          request("/api/application/", {
            method: "POST",
            body: JSON.stringify(data),
          }),
        withdraw: (id) =>
          request(`/api/application/withdraw/${id}`, { method: "GET" }),
        updateStatus: (id, data) =>
          request(`/api/application/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
          }),
        byId: (id) => request(`/api/application/${id}`),
      },
      interviews: {
        mine: () => request("/api/interview/my"),
        recruiter: () => request("/api/interview/"),
        create: (data) =>
          request("/api/interview/", {
            method: "POST",
            body: JSON.stringify(data),
          }),
        update: (id, data) =>
          request(`/api/interview/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
          }),
      },
      notifications: {
        mine: () => request("/api/notification/my"),
        read: (id) =>
          request(`/api/notification/${id}/read`, { method: "PATCH" }),
        readAll: () =>
          request("/api/notification/read-all", { method: "PATCH" }),
      },
      resume: {
        analyze: (file) => {
          const body = new FormData();
          body.append("resume", file);
          return request("/api/resumes/analyze", { method: "POST", body });
        },
        saved: () => request("/api/resumes/analysis"),
        match: (jobId, file) => {
          const body = new FormData();
          body.append("resume", file);
          return request(`/api/resumes/match/${jobId}`, {
            method: "POST",
            body,
          });
        },
      },
      companies: {
        get: (id) => request(`/api/company/${id}`),
        create: (data) =>
          request("/api/company/", {
            method: "POST",
            body: JSON.stringify(data),
          }),
      },
    }),
    [request, user, token, login, register, logout],
  );

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export default AppState;
