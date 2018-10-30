#!/bin/sh
./manage.py makemigrations
./manage.py makemigrations app
./manage.py migrate
./manage.py loaddata all
./manage.py graphql_schema --schema app.schema.relay_schema --out ./relay-schema.json
./manage.py graphql_schema --schema app.schema.apollo_schema --out ./apollo-schema.json
