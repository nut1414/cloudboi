#!/bin/bash

# Reference: https://github.com/amarjanica/docker-multi-postgres-databases/tree/main

set -e
set -u

function create_database_with_custom_user() {
	local database=$1
	local password=$2
	echo "  Creating custom user and database '$database'"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
	    CREATE USER $database WITH PASSWORD '$password';
	    CREATE DATABASE $database;
	    GRANT ALL PRIVILEGES ON DATABASE $database TO $database;
	    -- Grant schema privileges when using PostgreSQL 15+
	    GRANT ALL ON SCHEMA public TO $database;
EOSQL
}

function create_database_with_main_user() {
	local database=$1
	echo "  Creating database '$database' with main user"
	psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
	    CREATE DATABASE $database;
	    GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
	    -- Grant schema privileges when using PostgreSQL 15+
	    GRANT ALL ON SCHEMA public TO $POSTGRES_USER;
EOSQL
}

if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
	echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
	for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
		# Check if the input contains a colon (has password specified)
		if [[ $db == *":"* ]]; then
			# Extract database name and password (format: dbname:password)
			IFS=':' read -r dbname dbpassword <<< "$db"
			create_database_with_custom_user $dbname $dbpassword
		else
			# Just database name provided, use main Postgres user
			dbname=$db
			create_database_with_main_user $dbname
		fi
	done
	echo "Multiple databases created"
fi 