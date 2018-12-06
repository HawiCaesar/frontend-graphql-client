import React from "react";
import graphql from "babel-plugin-relay/macro";
import { commitMutation, QueryRenderer } from "react-relay";

import environment from "./environment";

const mutation = graphql`
  mutation AppMutation($input: CreateProductMutationInput!) {
    addProductToStore(input: $input) {
      productEdge {
        __typename
        cursor
        node {
          id
          name
          price
        }
      }
    }
  }
`;

function commit(environment, storeId, name, price) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: { storeId, name, price }
    },
    configs: [
      {
        type: "RANGE_ADD",
        parentID: storeId,
        connectionInfo: [
          {
            key: "App_products",
            rangeBehavior: "append"
          }
        ],
        edgeName: "productEdge"
      }
    ]
  });
}

export default class App extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query AppQuery {
            allStores {
              edges {
                node {
                  id
                  name
                  products(first: 20) @connection(key: "App_products") {
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
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error) {
            console.log(error);
            return <div>Error!</div>;
          }
          if (!props) {
            return <div>Loading data...</div>;
          }
          return (
            <div>
              <button
                onClick={() => {
                  commit(environment, "U3RvcmVOb2RlOjE=", "new Product", 50.0);
                }}
              >
                Add product
              </button>
              <pre style={{ padding: 10 }}>
                {JSON.stringify(props.allStores, null, 2)}
              </pre>
            </div>
          );
        }}
      />
    );
  }
}
