import React, {Component} from 'react';
import {Connect, query, mutation} from 'urql';
// import gql from 'graphql-tag';

const GetStoreListQuery = `
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

const GetStoreListWithOwnerQuery = `
	query StoreWithOwnerList {
		allStores {
			edges {
				node {
					id
					name
					owner {
						id
					}
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

class WithOwner extends Component {
  state = {
    withOwner: true,
  };

  render() {
    if (!this.state.withOwner) {
      return (
        <a href="#" onClick={() => this.setState({withOwner: true})}>
          Toggle
        </a>
      );
    }
    if (this.state.withOwner)
      return (
        <div>
          <a href="#" onClick={() => this.setState({withOwner: false})}>
            Toggle
          </a>
          <Connect query={query(GetStoreListWithOwnerQuery)}>
            {({loaded, fetching, refetch, data, error}) => {
              if (data) {
                return <div>{data.allStores.edges.length}</div>;
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
        <WithOwner />
      </div>
    );
  }
}

export default App;
