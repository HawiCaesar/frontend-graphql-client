import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Query, /*ApolloConsumer*/ Mutation } from "react-apollo";
import gql from "graphql-tag";
import './App.css';

const GET_STORES = gql`
{
  allStores {
    edges {
      node {
        id
        name
        owner {
          id
          username
          lastLogin
        }
        products {
          edges {
            node {
              id
              name
              price
            }
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
`;

const Stores = () => (
  <Query
    query={GET_STORES}
  >
  {({ loading, error, data }) => {
    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;

    const abc = data.allStores.edges.map((store, index) => (
      <li key={index}>
        <Link
          to={{
            pathname: `/store/${store.node.id}/products`,
            state: { storeDetails: store.node, storeProducts: store.node.products.edges }
          }}
        >
          {store.node.name}
        </Link>
      </li>
    ))
    return (
      <ul>{abc}</ul>
    )
  }}
  </Query>
)
// name parameter was required
const ADD_STORE = gql`
  mutation ADD_STORE($name: String!, $owner: String!){
    createOrUpdateStore(input: {
    name: $name
    owner: $owner
    }) {
      clientMutationId
      errors {
        field
        messages
      }
      id
      name
      owner
    }
  }
`;

class App extends Component {
  state = { 
    name: "",
    owner: "1"
   };

  handleChange = (e) => {
    this.setState({ name: e.target.value });
  }

  render() {
    return (
      <div className="App">
        <div>
          <h2>Results</h2>
          <Stores />
          <Mutation mutation={ADD_STORE} variables={this.state}>
            {(createOrUpdateStore, { data }) => (
              <div>
                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    const res = await createOrUpdateStore();
                    console.log(res);
                  }}
                >
                  <input 
                    type="text"
                    id="name"
                    name="name"
                    placeholder="name"
                    required
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                  <button type="submit">Add Store</button>
                </form>
              </div>
            )}
          </Mutation>
        </div>

      </div>
    );
  }
}

export default App;
