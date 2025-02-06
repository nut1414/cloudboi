#!/bin/bash

DEFAULT_LXD_CHANNEL=5.21/stable

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

printf "yes\n\nno\ncloudboi-main\nyes\ndir\nno\nno\nno\nyes\n\nyes\nyes\n\n\n" | lxd init 



# create resource group
echo "Creating resource group..."

lxc cluster group create cloudboi-resource
