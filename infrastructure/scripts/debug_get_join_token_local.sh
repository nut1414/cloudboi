#!/bin/bash

# check root
if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "Must be run as root"
    exit
fi

# ask user to input the node hostname
read -p "Enter the node hostname: " NODE_HOSTNAME
echo "NODE_HOSTNAME: $NODE_HOSTNAME"

JOIN_TOKEN=$(lxc cluster add $NODE_HOSTNAME | grep -E '^[A-Za-z0-9+/]+={0,2}$')
echo "JOIN_TOKEN: $JOIN_TOKEN"