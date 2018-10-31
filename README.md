To build the backend, run `make`.

To run the backend run `docker-compose up`.  Once it's up and running, mosey on over to http://localhost:8000/graphql/

To cleanly stop the backend run `docker-compose down`.

# Mutation examples

Create:

```graphql
mutation {
	createOrUpdateStore(input: {
	name: "Original name"
	owner: "1"
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
```

Update:

```graphql
mutation {
	createOrUpdateStore(input: {
	pk: 1,
	name: "New Names"
	owner: "1"
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
```
