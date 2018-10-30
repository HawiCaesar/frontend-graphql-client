import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from 'react-relay';

import environment from './environment';

export default class App extends React.Component {
	render() {
		return (
			<QueryRenderer
				environment={environment}
				query={graphql`query AppQuery {
					store(id: "U3RvcmVOb2RlOjE=") {
						id
						name
					}
					allProducts {
						edges {
							node {
								id
								name
								price
							}
						}
					}
				}`}
				variables={{}}
				render={({error, props}) => {
					if (error) {
						console.log(error);
						return <div>Error!</div>;
					}
					if (!props) {
						return <div>Loading data...</div>;
					}
					const users = props.allProducts.edges.map((edge, idx) => {
						return (
							<pre key={edge.node.id} style={{padding: 10}}>
								{JSON.stringify(edge.node, null, 2)}
							</pre>
						);
					});
					return (
						<div>
							<pre>
								{JSON.stringify(props.store, null, 2)}
							</pre>
							{users}
						</div>
					);
				}}
			/>
		);
	}
}
