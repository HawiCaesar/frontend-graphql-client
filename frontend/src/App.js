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
					allUsers {
						edges {
							node {
								id,
								username,
							}
						}
					}
				}`}
				variables={{}}
				render={({error, props}) => {
					console.log(props);
					if (error) {
						console.log(error);
						return <div>Error!</div>;
					}
					if (!props) {
						return <div>Loading...</div>;
					}
					return (
						<div>Loaded</div>
					);
				}}
			/>
		);
	}
}
