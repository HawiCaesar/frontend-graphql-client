default:
	docker-compose build
	docker-compose run python ./init.sh
