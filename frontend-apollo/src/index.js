import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import gql from "graphql-tag";
import './index.css';
import * as serviceWorker from './serviceWorker';

import StoreDetail from './components/StoreDetail';
import StoreList from './components/StoreList';

const client = new ApolloClient({
	uri: `/graphql-relay/`,
});

const ApolloWrappedApp = () => (
	<ApolloProvider client={client}>
		<Router>
			<Switch>
				<Route exact={true} path="/" component={StoreList} />
				<Route exact={true} path="/store/:storeId/" component={StoreDetail} />
			</Switch>
		</Router>
	</ApolloProvider>
)

ReactDOM.render(<ApolloWrappedApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
