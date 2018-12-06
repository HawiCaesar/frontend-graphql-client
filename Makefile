default:
	docker-compose build
	docker-compose run python ./init.sh
	cd frontend-relay; yarn install
	cd frontend-relay; yarn run relay
