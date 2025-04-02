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


# check if want to remove LXD
if [ "$FORCE" != "yes" ]; then
    echo "Do you want to remove LXD? (y/n)"
    read REMOVE_LXD
else
    REMOVE_LXD="y"
fi

if [ "$REMOVE_LXD" == "y" ]; then
    echo -e "Stopping LXD service..."
    snap stop lxd

    echo -e "Removing LXD snap..."
    snap remove lxd

    echo -e "LXD has been successfully removed" 
fi