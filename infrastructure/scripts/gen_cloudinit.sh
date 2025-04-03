#!/bin/bash

# Generate cloud-init that will be used to install LXD on the target machine

# check root
if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "Must be run as root"
    exit
fi

# Attempt to find the 10.* IP
TENTATIVE_IP=$(hostname -I | grep -o '10\.[0-9.]*' | head -n 1)

# Assign to HOST_IP: Use TENTATIVE_IP if it's not empty, otherwise use the first IP.
HOST_IP=${TENTATIVE_IP:-$(hostname -I | awk '{print $1}')}

ENDPOINT_PORT="8000"
# check if arg is provided
if [ -z "$1" ]; then
    # ask user to input the node hostname
    read -p "Enter the node hostname: " NODE_HOSTNAME
else
    NODE_HOSTNAME=$1
fi

#echo "NODE_HOSTNAME: $NODE_HOSTNAME"

JOIN_TOKEN=$(lxc cluster add $NODE_HOSTNAME | grep -E '^[A-Za-z0-9+/]+={0,2}$')
#echo "JOIN_TOKEN: $JOIN_TOKEN"
echo "cloud-init.yaml will be generated with the join token"
echo ""
echo "----------------------------------------"
echo ""


# Generate cloud-init configuration
cat << EOF > cloud-init.yaml
#cloud-config
package_update: true
package_upgrade: true

write_files:
  - path: /usr/local/bin/setup-lxd.sh
    permissions: '0755'
    content: |
      #!/bin/bash

      snap remove lxd
      snap install lxd
      
      # Extract join token
      JOIN_TOKEN=$JOIN_TOKEN
      
      # 1. 'yes' Use LXD Cluster
      # 2. '' Use default ip 
      # 3. 'yes' joining an existing cluster
      # 4. \${JOIN_TOKEN} join token
      # 5. 'yes' confirm all data lost
      # 6. '' confirm default storage pool
      # 7. 'yes' print yaml 
      # Initialize LXD with the join token
      printf "yes\n\nyes\n\${JOIN_TOKEN}\nyes\n\nyes\n" | lxd init 
      
      mkdir -p /var/snap/lxd/common/lxd/networks/lxdfan0/dnsmasq.hosts/
      chown root:lxd /var/snap/lxd/common/lxd/networks/lxdfan0/dnsmasq.hosts/
      chmod 775 /var/snap/lxd/common/lxd/networks/lxdfan0/dnsmasq.hosts/

      # Join resource group
      lxc cluster group add $NODE_HOSTNAME cloudboi-resource

runcmd:
  - /usr/local/bin/setup-lxd.sh
EOF

# read and print cloud-init.yaml
cat cloud-init.yaml
