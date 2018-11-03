import React from 'react';
import { Query, graphql } from "react-apollo";
import { Link } from 'react-router-dom';
import gql from "graphql-tag";

const GET_STORE_LIST = gql`
query StoreList {
	allStores {
		edges {
			node {
				id
				name
				owner {
					firstName
				}
			}
		}
	}
}
`;

export default class StoreList extends React.Component {
	render() {
		return (
			<Query query={GET_STORE_LIST}>
				{({ loading, error, data }) => {
					if (loading) return 'Loading...';
					if (error) return 'Error!';

					const stores = data.allStores.edges.map((store, idx) => (
						<div key={idx}>
							<Link
								to={{
									pathname: `/store/${store.node.id}/`,
									state: {
										store: store.node,
									},
								}}
							>
								{store.node.name}
							</Link>
							owned by {store.node.owner.firstName}
						</div>
					));

					return (
						<div>
							<h1>Stores</h1>
							{stores}
						</div>
					);
				}}
			</Query>
		);
	}
}
