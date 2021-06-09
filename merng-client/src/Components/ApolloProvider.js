import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost:5000",
})

const asyncAuthLink = setContext( (_, { headers }) => {
    const token = localStorage.getItem( "jwtToken" );
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${ token }` : ''
      }
    }
  }
);

const client = new ApolloClient({
  link: asyncAuthLink.concat( httpLink ),
  cache: new InMemoryCache(
  //   {
  //   typePolicies:{
  //     Post:{
  //       fields: {
  //         comments: {
  //           merge: (existing = [], incoming ) => {
  //             return incoming;
  //           },
  //         }
  //       }
  //     }
  //   }
  // }
  ),
});

const ApolloWrapper = props => {
  const { children } = props;
  return (
    <ApolloProvider client={ client } >
    { children }
    </ApolloProvider>
  )
};

export default ApolloWrapper;