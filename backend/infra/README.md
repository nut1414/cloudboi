# Initializing the infrastructure orchestrator

## MAAS

```sh

# removing maas
sudo ./clear_maas.sh


# installing and setting up maas
sudo ./init_maas.sh


```

maas should then be accessible at `https://yourip:5240/MAAS`

> Make sure to stop MAAS service before proceeding into init the LXD.
> Due to MAAS including its own LXD, overlapped of subnet usage will break LXD init script.

```sh

snap stop maas

```

## LXD

```sh

# remove lxd
snap remove lxd

# installing and config lxd
sudo ./init_main_lxd.sh

## detailed config for lxd

# 1. 'yes' Use LXD Cluster
# 2. '' Use default ip name
# 3. 'no' Not joinning an existing cluster
# 4. 'cloudboi-main' Cluster name: cloudboi-main
# 5. 'yes' Config new storage pool
# 6. 'dir' Name of the new storage pool: dir
# 7. 'no' Don't use remote storage
# 8. 'no' Don't connect to maas
# 9. 'yes' Use existing bridge/interface
# 10. 'ACTIVE_INTERFACE' Name of the existing bridge/interface check by using this command -> " ip link show | grep 'state UP' | awk '{print $2}' | tr -d : "
# 11. 'yes' stale cached image
# 12. 'yes' print yaml

```

lxd should be accessible at `https://yourip:8443`

open lxd in browser

proceed to follow the on-screen instruction (generate then use the cert to trust on the lxd) \*note that this is not required, everything can be done on terminal with `lxc` command

for connection with pylxd client, please read up on document here:
https://pylxd.readthedocs.io/en/latest/authentication.html#generate-a-certificate


## cloud-init

When deploying a node on MAAS, we can use `gen_cloudinit.sh` to generate cloud-init file to config auto node join. 

noted that this required `init_maas.sh` and `init_main_lxd.sh` to be properly installed first.

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
