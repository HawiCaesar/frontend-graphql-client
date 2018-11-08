import React, {Component} from 'react';
import {Connect, query, mutation} from 'urql';
// import gql from 'graphql-tag';

const GetStoreListQuery = `
	query StoreList {
		allUsers {
			edges {
				node {
					id
					firstName
					lastName
				}
			}
		}
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

const AddStoreQuery = `
	mutation CreateStore {
		addStore(input: {
			ownerId: "VXNlck5vZGU6MQ=="
			name: "Dog Shop"
		}) {
			clientMutationId
			store {
				id
				name
			}
		}
	}
`;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Connect
          query={query(GetStoreListQuery)}
          mutation={{
            addStore: mutation(AddStoreQuery),
          }}>
          {({loaded, fetching, refetch, data, error, addStore}) => {
            return (
              <div>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    addStore();
                  }}>
                  <button type="submit">Add Store</button>
                </form>
              </div>
            );
          }}
        </Connect>
      </div>
    );
  }
}

export default App;
