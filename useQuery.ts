import { useEffect, useState } from "preact/hooks";
import { doFetch } from "./utils.ts";

/**
 * Hook for fetching data from a GraphQL API
 * @param url API URL
 * @param query GraphQL query
 * @param variables GraphQL query variables
 * @returns data, loading, error, refetch
 * @example  ```tsx
 * const { data, loading, error, refetch } = useQuery<{ user }>(
 *                                          "https://api.example.com/graphql",
 *                                          "query user($id: ID!){ user(id: $id) { name } }",
 *                                           { id: 1 },
 *                                           { Authorization : "Bearer token xxx") } );
 * ```
 */
export function useQuery<DataType, VarsType>(
  url: string,
  query: string,
  variables?: VarsType,
  headers?: Record<string, string>
): {
  data: DataType | null;
  loading: boolean;
  error: Error | null;
  refetch: (newURL?: string, newVariables?: VarsType) => void;
} {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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
  }, [variables]);

  const refetch = (
    newURL?: string,
    newVariables?: VarsType,
    newHeaders?: Record<string, string>
  ) => {
    setLoading(true);
    setError(null);
    doFetch(
      newURL ?? url,
      query,
      newVariables || variables,
      newHeaders || headers
    )
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
  return { data, loading, error, refetch };
}
