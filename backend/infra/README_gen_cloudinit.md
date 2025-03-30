### Cloud-init Generator for onboarding new lxd cluster

Node are deployed with installation of lxd via snap and setup for cluster joining

Node newly deployed are expected to:
1. Remove existing lxd if present
2. Install lxd via snap
3. Initialize lxd with join token
4. Setup dnsmasq hosts directory permissions
5. Join the resource group

## Usage

```sh
# Run as root
sudo ./gen_cloudinit.sh [node_hostname]

# If no hostname is provided, script will prompt for input
```

## Generated cloud-init.yaml

The script will generate a cloud-init.yaml that:
1. Updates and upgrades the system
2. Creates a setup script at `/usr/local/bin/setup-lxd.sh` that:
   - Removes existing lxd installation
   - Installs lxd via snap
   - Initializes lxd with join token (automatically answers prompts)
   - Sets up dnsmasq hosts directory permissions
   - Joins the node to the cloudboi-resource group

## Join Token Generation

The script generates a join token using:
```sh
JOIN_TOKEN=$(lxc cluster add $NODE_HOSTNAME | grep -E '^[A-Za-z0-9+/]+={0,2}$')
```

## LXD Initialization

The initialization process automatically answers the prompts:
1. 'yes' - Use LXD Cluster
2. '' - Use default ip
3. 'yes' - joining an existing cluster
4. ${JOIN_TOKEN} - join token
5. 'yes' - confirm all data lost
6. '' - confirm default storage pool
7. 'yes' - print yaml
