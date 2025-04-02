#!/bin/bash

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

# check if want to remove MAAS
if [ "$FORCE" != "yes" ]; then
    echo "Do you want to remove MAAS? (y/n)"
    read REMOVE_MAAS
else
    REMOVE_MAAS="y"
fi

# remove MAAS
if [ "$REMOVE_MAAS" == "y" ]; then
    snap remove maas
    sudo -u postgres psql -c "DROP DATABASE maasdb;"
    sudo -u postgres psql -c "DROP USER maas;"
    apt remove -y postgresql-16
    systemctl stop postgresql
    systemctl disable --now postgresql
    echo "MAAS removed"
fi