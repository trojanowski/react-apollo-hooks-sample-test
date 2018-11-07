import React from 'react';
import gql from 'graphql-tag';
import { useApolloQuery } from 'react-apollo-hooks';

export default function Hello() {
  const { data, error, loading } = useApolloQuery(gql`
    query HelloQuery {
      hello
    }
  `);

  if (error) {
    throw error;
  }

  return <div>{data.hello}</div>;
}
