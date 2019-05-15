import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

export default function Hello() {
  const { data, error, loading } = useQuery(gql`
    query HelloQuery {
      hello
    }
  `);

  if (error) {
    throw error;
  }

  if (loading) {
    return <div>Loading</div>;
  }

  return <div>{data.hello}</div>;
}
