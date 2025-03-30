#!/bin/bash

DEFAULT_LXD_CHANNEL=5.21/stable

TENTATIVE_IP=$(hostname -I | grep -o '10\.[0-9.]*' | head -n 1)

# Assign to HOST_IP: Use TENTATIVE_IP if it's not empty, otherwise use the first IP.
HOST_IP=${TENTATIVE_IP:-$(hostname -I | awk '{print $1}')}

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

# check if want to install LXD
echo "Do you want to install LXD? (y/n)"
read INSTALL_LXD

if [ "$INSTALL_LXD" != "y" ]; then
    exit
fi

# stop maas to avoid conflict
echo "Stopping MAAS to prevent conflict"
snap stop maas

# install LXD and dependencies
snap install lxd --channel=${DEFAULT_LXD_CHANNEL}

# 1. 'yes' Use LXD Cluster
# 2. '' Use default ip name
# 3. 'no' Not joinning an existing cluster
# 4. 'cloudboi-main' Cluster name: cloudboi-main
# 5. 'yes' Config new storage pool
# 6. 'dir' Name of the new storage pool: dir
# 7. 'no' Don't use remote storage
# 8. 'no' Don't connect to maas
# 9. 'no' Use existing bridge/interface
# 10. 'yes' Create a new fan overlay network,
# 11. '' Auto subnet for fan overlay network 
# 12. 'yes' stale cached image
# 13. 'yes' print yaml 

# init LXD
echo "Initializing LXD..."

printf "yes\n${HOST_IP}\nno\ncloudboi-main\nyes\ndir\nno\nno\nno\nyes\n\nyes\nyes\n\n\n" | lxd init 

# create resource group
echo "Creating resource group..."

lxc cluster group create cloudboi-resource

# stop lxd
echo "Stopping LXD to start MAAS..."
snap stop lxd

# start maas
echo "Starting MAAS..."
snap start maas

# start lxd
echo "Starting LXD..."
snap start lxd
