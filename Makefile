default:
	docker-compose build
	docker-compose run python ./init.sh

schema:
	docker-compose run python ./print-schema.sh
