#!/bin/sh
./manage.py makemigrations
./manage.py makemigrations app
./manage.py migrate
./manage.py loaddata all
./manage.py graphql_schema --schema app.schema.schema --out ./relay-schema.json
