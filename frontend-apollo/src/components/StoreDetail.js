import React from 'react';
import {Query, Mutation} from 'react-apollo';
import gql from 'graphql-tag';

const GET_STORE_DETAIL = gql`
  query StoreDetail($storeId: ID!) {
    store(id: $storeId) {
      id
      name
      owner {
        firstName
        lastName
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
`;

const ADD_PRODUCT_TO_STORE = gql`
  mutation AddProductToStore($storeId: ID!, $name: String!, $price: Float!) {
    addProductToStore(input: {storeId: $storeId, name: $name, price: $price}) {
      product {
        id
        name
        price
      }
    }
  }
`;

class CreateStore extends React.Component {
  state = {
    name: '',
    price: 0.99,
    storeId: this.props.storeId,
  };

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };

  render() {
    return (
      <Mutation mutation={ADD_PRODUCT_TO_STORE} variables={this.state}>
        {(mutate, {data}) => {
          const handleSubmit = async e => {
            e.preventDefault();
            mutate({
              optimisticResponse: {
                __typename: 'Mutation',
                addProductToStore: {
                  product: {
                    id: Math.random(), // <--- Totally necessary!
                    name: this.state.name,
                    price: this.state.price,
                    isOptimistic: true,
                    __typename: 'ProductNode',
                  },
                  __typename: 'CreateProductMutationPayload',
                },
              },
              update: (
                proxy,
                {
                  data: {
                    addProductToStore: {product},
                  },
                },
              ) => {
                const data = proxy.readQuery({
                  query: GET_STORE_DETAIL,
                  variables: this.state,
                });
                data.store.products.edges.push({
                  node: product,
                  __typename: 'ProductNodeEdge',
                });
                proxy.writeQuery({
                  query: GET_STORE_DETAIL,
                  variables: this.state,
                  data,
                });
              },
            });
          };

          return (
            <div>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  id="productName"
                  name="name"
                  placeholder="Product Name"
                  required
                  value={this.state.name}
                  onChange={this.handleChange}
                />
                <br />
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  name="price"
                  placeholder="Product Price"
                  required
                  value={this.state.price}
                  onChange={this.handleChange}
                />
                <button type="submit">Add Product</button>
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default class StoreDetail extends React.Component {
  render() {
    return (
      <div>
        <Query
          query={GET_STORE_DETAIL}
          variables={{
            storeId: this.props.match.params.storeId,
          }}>
          {({loading, error, data}) => {
            if (loading) return 'Loading...';
            if (error) return 'Error!';

            const productTableRows = data.store.products.edges.map(
              (product, idx) => (
                <tr
                  key={idx}
                  style={{opacity: product.isOptimistic ? '0.5' : '1'}}>
                  <td>{product.node.name}</td>
                  <td>{product.node.price}</td>
                </tr>
              ),
            );

            return (
              <div>
                <h1>Store: {data.store.name}</h1>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>{productTableRows}</tbody>
                </table>
              </div>
            );
          }}
        </Query>
        <div>
          <CreateStore storeId={this.props.match.params.storeId} />
        </div>
      </div>
    );
  }
}
