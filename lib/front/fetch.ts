import useSWR from "swr";
import { APIError } from "../api/api-error";

function baseUrl(): string {
  if (process.env.NODE_ENV === "production") return "https://acorn.social";
  else return "http://localhost:3000";
}

interface SWRFetcherConfig {
  path: string;
  method?: "post" | "get" | "delete" | "put";
  throwOnHTTPError?: boolean;
  cache?: { key: string; len: number };
}

const swrFetcher = ({
  path,
  method = "get",
  throwOnHTTPError = true,
}: SWRFetcherConfig) => {
  const fullUrl = `${baseUrl()}/api${path}`;
  return fetch(fullUrl, {
    method,
  }).then((res) => {
    return new Promise((ret, rej) => {
      res
        .text()
        .then((text) => {
          const json = JSON.parse(text);
          const bytes = text.length;
          console.log(
            `${method.toUpperCase()} ${fullUrl}: (${
              res.status
            }) ${bytes} bytes -\n${
              bytes < 100
                ? text
                : `${text.slice(0, 100)}... ${bytes - 100} more bytes`
            }`
          );
          if (throwOnHTTPError && !res.ok)
            throw new APIError(res.status, json.error);
          ret(json);
        })
        .catch(rej);
    });
  });
};

export function useFetch<T = unknown>(config: SWRFetcherConfig) {
  // @ts-ignore
  const { data, error } = useSWR<T>(config, swrFetcher);
  return { data, error };
}

export async function fetcher<T extends object>({
  url,
  method = "get",
  body,
  token,
  throwOnHTTPError = true,
  cache = "default",
}: {
  url: string;
  token?: string;
  body?: object;
  method?: "post" | "get" | "delete" | "put";
  throwOnHTTPError?: boolean;
  cache?: RequestCache;
}): Promise<T> {
  let authHeaders = {};

  if (token) {
    authHeaders = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
  }

  const fullUrl = `${baseUrl()}/api${url}`;
  const res = await fetch(fullUrl, {
    method,
    credentials: "same-origin",
    body: body ? JSON.stringify(body) : undefined,
    cache,
    ...authHeaders,
  });
  const text = await res.text();
  const json = JSON.parse(text);
  console.log(
    `${method.toUpperCase()} ${fullUrl}: (${res.status}) ${
      text.length
    } bytes -\n${text}`
  );
  if (throwOnHTTPError && !res.ok) throw new APIError(res.status, json.error);
  return json;
}
