To build the backend, run `make`.

To run the backend run `docker-compose up`.  Once it's up and running, mosey on over to http://localhost:8000/graphql/

To cleanly stop the backend run `docker-compose down`.

# Mutation examples

Create a product:

```graphql
mutation AddProductToStore {
	addProductToStore(input: {
		storeId: "U3RvcmVOb2RlOjE="
		name: "New product name!"
		price: 10.99
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
```

outputs

```json
{
	"data": {
		"addProductToStore": {
			"product": {
				"id": "UHJvZHVjdE5vZGU6MTE=",
				"store": {
					"id": "U3RvcmVOb2RlOjE=",
					"name": "New Names"
				}
			}
		}
	}
}
```

Update a product


```graphql
mutation UpdateStoreProduct {
  updateStoreProduct(input: {
    id: "UHJvZHVjdE5vZGU6MQ=="
    storeId: "U3RvcmVOb2RlOjE="
  }) {
    product {
      id
      name
      price
      store {
        id
      }
    }
  }
}
```

outputs

```json
{
  "data": {
    "updateStoreProduct": {
      "product": {
        "id": "UHJvZHVjdE5vZGU6MQ==",
        "name": "Alligator Toes",
        "price": 11.19,
        "store": {
          "id": "U3RvcmVOb2RlOjE="
        }
      }
    }
  }
}
```
