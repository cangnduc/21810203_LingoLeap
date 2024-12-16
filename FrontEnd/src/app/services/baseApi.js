import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/authSlice";
import { setAccessToken } from "../features/authSlice";
import { BACKEND_URL } from "../../constant";
const REFRESH_URL = "/auth/refresh";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const baseApi = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/api/v1`,

  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const customFetchWithProgress = async (url, options, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || "GET", url);

    for (const header in options.headers) {
      xhr.setRequestHeader(header, options.headers[header]);
    }

    xhr.onload = () => {
      resolve({
        status: xhr.status,
        statusText: xhr.statusText,
        text: () => Promise.resolve(xhr.responseText),
        json: () => Promise.resolve(JSON.parse(xhr.responseText)),
      });
    };

    xhr.onerror = () => {
      reject(new TypeError("Network request failed"));
    };

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    };

    xhr.send(options.body);
  });
};

export const baseApiWithReauth = async (args, api, extraOptions) => {
  if (args.url === "/auth/login") {
    return baseApi(args, api, extraOptions);
  }
  try {
    let result = await baseApi(args, api, extraOptions);

    if (result?.error?.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            args.headers.authorization = `Bearer ${token}`;
            return baseApi(args, api, extraOptions);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const refreshResult = await baseApi(
          { url: REFRESH_URL, method: "POST", credentials: "include" },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const newToken = refreshResult.data.data;
          api.dispatch(setAccessToken(newToken));
          processQueue(null, newToken);
          args.headers.authorization = `Bearer ${newToken}`;
          return baseApi(args, api, extraOptions);
        } else {
          processQueue(new Error("Failed to refresh token"));
          api.dispatch(logout());
          return Promise.reject(new Error("Failed to refresh token"));
        }
      } catch (refreshError) {
        processQueue(refreshError);
        api.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (args.formData) {
      const url = `${api.baseUrl}${args.url}`;
      const options = {
        ...args,
        headers: {
          ...args.headers,
          authorization: `Bearer ${api.getState().auth.accessToken}`,
        },
      };

      return customFetchWithProgress(url, options, (progress) => {
        api.dispatch({ type: "uploadProgress", payload: progress });
      });
    }

    return result;
  } catch (error) {
    return Promise.reject(error);
  }
};
