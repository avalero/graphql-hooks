import { useEffect, useState } from "preact/hooks";
import { doFetch } from "./utils.ts";

/**
 * Hook for fetching data from a GraphQL API
 * @param url API URL
 * @param query GraphQL query
 * @param variables GraphQL query variables
 * @returns data, loading, error, lazyQuery
 * @example  ```tsx
 * const { data, loading, error, lazyQuery } = useLazyQuery<{ user }>(
 *                                         "https://api.example.com/graphql",
 *                                        "query user($id: ID!){ user(id: $id) { name } }",
 *                                         { Authorization : "Bearer token xxx") } );
 * ```
 */

export function useLazyQuery<DataType, VarsType>(
  url: string,
  query: string,
  headers?: Record<string, string>
): {
  data: DataType | null;
  loading: boolean;
  error: Error | null;
  lazyQuery: (variables?: VarsType) => void;
} {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const lazyQuery = (variables?: VarsType) => {
    setLoading(true);
    doFetch(url, query, variables, headers)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => setData(data.data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  return { data, loading, error, lazyQuery };
}
