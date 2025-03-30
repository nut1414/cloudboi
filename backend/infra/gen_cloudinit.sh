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

# ask user to input the node hostname
read -p "Enter the node hostname: " NODE_HOSTNAME
echo "NODE_HOSTNAME: $NODE_HOSTNAME"

JOIN_TOKEN=$(lxc cluster add $NODE_HOSTNAME | grep -E '^[A-Za-z0-9+/]+={0,2}$')
echo "JOIN_TOKEN: $JOIN_TOKEN"

# Generate cloud-init configuration
cat << EOF > cloud-init.yaml
#cloud-config
package_update: true
package_upgrade: true
packages:
  - lxd
  - jq
  - curl

write_files:
  - path: /usr/local/bin/setup-lxd.sh
    permissions: '0755'
    content: |
      #!/bin/bash
      
      # Get node hostname
      NODE_IP=\$(hostname -I | awk '{print $1}')
      
      # Get join token from backend
      JSON_BODY=\$(curl -X POST \\
        -H "Content-Type: application/json" \\
        -H "Accept: application/json" \\
        -d "{\\"server_name\\": \\"\$NODE_HOSTNAME\\"}" \\
        http://${HOST_IP}:${ENDPOINT_PORT}/internal/cluster/create_token)
      
      # Extract join token
      JOIN_TOKEN=\$(echo \$JSON_BODY | jq -r '.join_token')
      
      # 1. 'yes' Use LXD Cluster
      # 2. '' Use default ip 
      # 3. 'yes' joining an existing cluster
      # 4. \${JOIN_TOKEN} join token
      # 5. 'yes' confirm all data lost
      # 6. '' confirm default storage pool
      # 7. 'yes' print yaml 
      # Initialize LXD with the join token
      printf "yes\n\nyes\n\${JOIN_TOKEN}\nyes\n\nyes\n" | lxd init 
      
      # Join resource group
      curl -X POST \\
        -H "Content-Type: application/json" \\
        -H "Accept: application/json" \\
        -d "{\\"server_name\\": \\"\$NODE_HOSTNAME\\"}" \\
        http://${HOST_IP}:${ENDPOINT_PORT}/internal/add_member

runcmd:
  - systemctl enable lxd
  - systemctl start lxd
  - /usr/local/bin/setup-lxd.sh
EOF

# read and print cloud-init.yaml
cat cloud-init.yaml
