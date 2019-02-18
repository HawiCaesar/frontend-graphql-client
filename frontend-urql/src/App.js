import React, { Component } from "react";
import { Connect, query, mutation } from "urql";
// import gql from 'graphql-tag';

const GetStoreListQuery = /* GraphQL */ `
  query StoreList {
    allStores {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const GetStoreListWithOwnerQuery = /* GraphQL */ `
  query StoreWithOwnerList {
    allStores {
      edges {
        node {
          id
          name
          owner {
            id
            firstName
          }
        }
      }
    }
  }
`;

const AddStoreQuery = /* GraphQL */ `
  mutation CreateStore {
    addStore(input: { ownerId: "VXNlck5vZGU6MQ==", name: "Dog Shop" }) {
      clientMutationId
      store {
        id
        name
      }
    }
  }
`;

class StoreCount extends Component {
  state = {
    withOwner: true
  };

  render() {
    if (!this.state.withOwner) {
      return (
        <a href="#test" onClick={() => this.setState({ withOwner: true })}>
          Toggle
        </a>
      );
    }
    if (this.state.withOwner)
      return (
        <div>
          <a href="#test" onClick={() => this.setState({ withOwner: false })}>
            Toggle
          </a>
          <Connect
            query={query(GetStoreListWithOwnerQuery)}
            shouldInvalidate={() => true}
          >
            {({ loaded, fetching, refetch, data, error }) => {
              if (data) {
                return <div>{data.allStores}</div>;
              } else {
                return <div>Whatttt</div>;
              }
            }}
          </Connect>
        </div>
      );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Connect
          query={query(GetStoreListQuery)}
          mutation={{
            addStore: mutation(AddStoreQuery)
          }}
        >
          {({
            loaded,
            refreshAllFromCache,
            fetching,
            refetch,
            cache,
            data,
            error,
            addStore
          }) => {
            return (
              <div>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    addStore().then(() => {
                      cache.invalidateAll();
                      refreshAllFromCache();
                    });
                  }}
                >
                  <button type="submit">Add Store</button>
                </form>
              </div>
            );
          }}
        </Connect>
        <StoreCount />
      </div>
    );
  }
}

export default App;
