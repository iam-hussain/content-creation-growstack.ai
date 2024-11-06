"use client";

import { ApolloProvider } from "@apollo/client";

import client from "@/lib/graphql-client";

export function ClientProvider({ children }: any) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
