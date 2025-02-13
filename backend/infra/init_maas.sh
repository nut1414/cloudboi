#!/bin/bash

MAAS_CHANNEL=3.5
MAAS_DB_USER=maas
MAAS_DB_NAME=maasdb
MAAS_DB_PASSWORD=maas
DEFAULT_MAAS_ADMIN_USERNAME=admin
DEFAULT_MAAS_ADMIN_PASSWORD=admin
DEFAULT_MAAS_ADMIN_EMAIL=admin@example.com

# check root
if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "Must be run as root"
    exit
fi

# check if snap is installed
if ! [ -x "$(command -v snap)" ]; then
    echo "snap is not installed (install using 'sudo apt install snapd')"
    exit
fi

# check if want to install MAAS
echo "Do you want to install MAAS? (y/n)"
read INSTALL_MAAS

if [ "$INSTALL_MAAS" != "y" ]; then
    exit
fi

# ask for maas admin username and password
echo "Enter MAAS admin username (default: admin)"
read MAAS_ADMIN_USERNAME

echo "Enter MAAS admin password (default: admin)"
read MAAS_ADMIN_PASSWORD

echo "Enter MAAS admin email (default: admin@example.com)"

if [ -z "$MAAS_ADMIN_USERNAME" ]; then
    MAAS_ADMIN_USERNAME=$DEFAULT_MAAS_ADMIN_USERNAME
fi

if [ -z "$MAAS_ADMIN_PASSWORD" ]; then
    MAAS_ADMIN_PASSWORD=$DEFAULT_MAAS_ADMIN_PASSWORD
fi

if [ -z "$MAAS_ADMIN_EMAIL" ]; then
    MAAS_ADMIN_EMAIL=$DEFAULT_MAAS_ADMIN_EMAIL
fi

############################################

echo "Installng MAAS..."
systemctl disable --now systemd-timesyncd


# install MAAS and dependencies
snap install maas --channel=${MAAS_CHANNEL}


# install postgresql
apt install -y postgresql-16
systemctl start postgresql
systemctl enable --now postgresql


echo "Configuring MAAS..."
# create maas user and database
sudo -i -u postgres psql -c "CREATE USER $MAAS_DB_USER WITH PASSWORD '$MAAS_DB_PASSWORD';"
sudo -i -u postgres createdb -O $MAAS_DB_USER $MAAS_DB_NAME

# add db to pg_hba
echo "host $MAAS_DB_NAME $MAAS_DB_USER 0/0 md5" >> /etc/postgresql/16/main/pg_hba.conf

echo "Restarting postgresql..."
# restart postgresql
systemctl restart postgresql

echo "---------------------------------"
# Initialize MAAS
echo "Initializing MAAS..."
echo "Please enter the request information when prompted."
maas init region+rack --database-uri postgres://$MAAS_DB_USER:$MAAS_DB_PASSWORD@localhost:5432/$MAAS_DB_NAME

# create admin user
maas createadmin --username=$MAAS_ADMIN_USERNAME --password=$MAAS_ADMIN_PASSWORD --email=$MAAS_ADMIN_EMAIL


echo "MAAS installed and configured"


