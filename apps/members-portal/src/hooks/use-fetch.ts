import { useState, useCallback } from "react";

export type AuthPayload = {
  iat: number;
  exp: number;
  token: string;
};

type useHttpRequestOptions = { requiresAuth?: boolean } & RequestInit;

// Wrapper on top of fetch that executes request with hardcoded authentication if needed.
function useHttpRequest(url: string, options: useHttpRequestOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // Looks for auth token and sets it in localstorage.
  const fetchToken = useCallback(async () => {
    const token = localStorage.getItem("token");
    const tokenExp = localStorage.getItem("tokenExp");

    if (!token || tokenIsExpired({ token, exp: Number(tokenExp) })) {
      const rawPayload = await fetch("http://localhost:8081/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "sarah", password: "connor" }),
      });

      const payload = await rawPayload.json();

      localStorage.setItem("token", payload.token);
      localStorage.setItem("tokenExp", payload.exp);

      return payload;
    }

    return { token };
  }, []);

  // Request callback that will create/refresh auth token if needed.
  // Optional body can be provided.
  const request = useCallback(
    async (body?: BodyInit) => {
      setIsLoading(true);

      try {
        let APayload: AuthPayload | null = null;

        if (options.requiresAuth) {
          APayload = await fetchToken();
        }

        const response = await fetch(url, {
          ...options,
          body,
          headers: APayload
            ? {
                ...options.headers,
                Authorization: `Bearer ${APayload?.token}`,
              }
            : options.headers,
        });

        const responseData = await response.json();

        return responseData;
      } catch (error: unknown) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchToken, options, url]
  );

  return { request, response: { isLoading, error } };
}

export default useHttpRequest;

// Helper function that determines whether the token is expired or not
const tokenIsExpired = (payload: Omit<AuthPayload, "iat">): boolean => {
  return Math.floor(Date.now() / 1000) > payload.exp;
};
