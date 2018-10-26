default:
	docker-compose build
	docker-compose run python ./init.sh
	cd frontend; yarn install
	cd frontend; yarn run relay
