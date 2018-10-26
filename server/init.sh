#!/bin/sh
./manage.py makemigrations
./manage.py makemigrations app
./manage.py migrate
./manage.py loaddata all
