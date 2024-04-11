# preact-hooks/graphql


### Examples (tested on Deno Fresh 1.6.8)

#### useQuery without vars

```ts
import { useQuery } from "../hooks/useQuery.ts";

const GraphQL = () => {
  const url = "https://rickandmortyapi.com/graphql";
  const query = `query { characters { results { name } } }`;
  const { data, loading, error, refetch } = useQuery<
    { characters: { results: { name: string }[] } },
    null
  >(
    url,
    query,
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as any).message}</p>;
  return (
    <>
      <ul>
        {data?.characters.results.map((character) => <li>{character.name}</li>)}
      </ul>
      <button onClick={() => refetch()}>
        Refetch
      </button>
    </>
  );
};

export default GraphQL;
```

#### useQuery with vars

```ts
import { useQuery } from "../hooks/useQuery.ts";

const GraphQLwithVars = () => {
  const url = "https://rickandmortyapi.com/graphql";
  const query =
    `query character($name: String!) { characters(filter: { name: $name }) { results { name } } }`;
  const variables = { name: "Rick" };
  const { data, loading, error, refetch } = useQuery<
    { characters: { results: { name: string }[] } },
    { name: string }
  >(
    url,
    query,
    variables,
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as any).message}</p>;
  return (
    <>
      <ul>
        {data?.characters.results.map((character) => <li>{character.name}</li>)}
      </ul>
      <button onClick={() => refetch()}>
        Refetch
      </button>
    </>
  );
};

export default GraphQLwithVars;

```
