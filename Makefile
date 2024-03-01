SAIL=./vendor/bin/sail

install:
	./bin/setup_sail.sh
	@make up
	$(SAIL) composer install
	$(SAIL) artisan key:generate
	$(SAIL) artisan storage:link
	@make fresh
	@make run-install
	@make run-build

# Docker ////////////////////////////////////////////////////////////////////////////
up:
	$(SAIL) up -d
stop:
	$(SAIL) stop
down:
	$(SAIL) down --remove-orphans
destroy:
	$(SAIL) down --rmi all --volumes --remove-orphans
restart:
	$(SAIL) restart
ps:
	$(SAIL) ps

# Log ////////////////////////////////////////////////////////////////////////////
logs:
	$(SAIL) logs
logs-watch:
	$(SAIL) logs --follow

# Docker container ////////////////////////////////////////////////////////////////////////////
laravel:
	$(SAIL) exec laravel.test bash
db:
	$(SAIL) exec mysql bash

# Front ////////////////////////////////////////////////////////////////////////////
run:
	$(SAIL) exec laravel.test npm run dev
run-install:
	$(SAIL) exec laravel.test npm install
run-build:
	$(SAIL) exec laravel.test npm run build

# DB ////////////////////////////////////////////////////////////////////////////
migrate:
	$(SAIL) artisan migrate
migrate-rollback:
	$(SAIL) artisan migrate:rollback
fresh:
	$(SAIL) artisan migrate:fresh --seed
seed:
	$(SAIL) artisan db:seed
tinker:
	$(SAIL) tinker
sql:
	$(SAIL) mysql

# TEST ////////////////////////////////////////////////////////////////////////////
test:
	$(SAIL) test
test-coverage:
	$(SAIL) test --coverage

# Laravel create file ////////////////////////////////////////////////////////////////////////////
# make create-mcr name=User
create-mcr:
	$(SAIL) exec laravel.test php artisan make:model $(name) -mcr
	sudo chown -R 1000:1000 ./app/Http/Controllers
	sudo chown -R 1000:1000 ./app/Models
	sudo chown -R 1000:1000 ./database/migrations

# make create-migration table_name=carshares
create-migration:
	$(SAIL) exec laravel.test php artisan make:migration create_$(table_name)_table --create=$(table_name)
	sudo chown -R 1000:1000 ./database/migrations

# make create-controller name=Auth
create-controller:
	$(SAIL) exec laravel.test php artisan make:controller $(name)Controller --resource
	sudo chown -R 1000:1000 ./app/Http/Controllers

# make create-model name=User
create-model:
	$(SAIL) exec laravel.test php artisan make:model $(name)
	sudo chown -R 1000:1000 ./app/Models
