import React from 'react';
import { Link } from 'react-router-dom';
import { Query, /*ApolloConsumer*/ Mutation } from "react-apollo";
import gql from "graphql-tag";

const ADD_PRODUCT_IN_STORE = gql`
mutation ADD_PRODUCT_IN_STORE($storeId: ID!, $name: String!, $price: Float!){
	addProductToStore(input: {
		storeId: $storeId
		name: $name
		price: $price
		}) {
		product {
			id
				store {
					id
					name
				}
		}
	}
}
`;

class Products extends React.Component {
  state = {
    name: "",
    price: 0,
    storeId:  this.props.match.params.store_id
  }

  handleChange = event => {
    this.setState({ [event.target.name]:  event.target.value});
  }

  render() {
    return (
      <div>
        <h2>{this.props.location.state.storeDetails.name}</h2>
        <ul>
          {
            this.props.location.state.storeProducts.map((product, index) => {
              return (
                <li key={index}>{product.node.name} ---- {product.node.price}</li>
              )
            }) 
          }
        </ul>
        <Mutation mutation={ADD_PRODUCT_IN_STORE} variables={this.state}>
            {(addProductToStore, { data }) => (
              <div>
                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    // console.log(this.state, '***')
                    const res = await addProductToStore();
                    console.log(res);
                  }}
                >
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
            )}
          </Mutation>
      </div>
    )
  }
}

export default Products;