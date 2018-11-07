import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { MockLink } from 'apollo-link-mock';
import React, { Suspense } from 'react';
import gql from 'graphql-tag';
import { cleanup, render } from 'react-testing-library';

import Hello from '../Hello';

afterEach(cleanup);

const HELLO_MOCKS = [
  {
    request: {
      query: gql`
        query HelloQuery {
          hello
        }
      `,
      variables: {},
    },
    result: {
      data: {
        hello: 'World',
      },
    },
  },
];

function createClient(mocks) {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink(mocks),
  });
}

// Possible alternative implementations:
// const waitForNextTick = () => new Promise(resolve => setImmediate(resolve));
// const waitForNextTick = () =>
//   new Promise(resolve => requestAnimationFrame(resolve));
const waitForNextTick = () => new Promise(resolve => setTimeout(resolve));

describe('<Hello />', () => {
  it('should render', async () => {
    const client = createClient(HELLO_MOCKS);
    const { container } = render(
      <Suspense fallback={<div>Loading</div>}>
        <ApolloProvider client={client}>
          <Hello />
        </ApolloProvider>
      </Suspense>
    );
    // Initially the suspense fallback is rendered
    expect(container.textContent).toBe('Loading');
    // This line is required to run queued `useEffect` hooks until these issues
    // are solved:
    // https://github.com/kentcdodds/react-testing-library/pull/216
    // https://github.com/facebook/react/issues/14050
    render(null);
    // We have to wait for the next tick for the queries to be fetched
    await waitForNextTick();
    expect(container.textContent).toBe('World');
  });
});
