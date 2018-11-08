import React, {Component} from 'react';
import {Connect, query} from 'urql';

const GET_STORE_LIST = `
query StoreList {
	allStores {
		edges {
			node {
				id
			}
		}
	}
}
`;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Connect query={query(GET_STORE_LIST)}>
          {({loaded, fetching, refetch, data, error, addTodo}) => {
            return <pre>{JSON.stringify(data, null, 2)}</pre>;
          }}
        </Connect>
      </div>
    );
  }
}

export default App;
