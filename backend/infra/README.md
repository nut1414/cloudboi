# Initializing the infrastructure orchestrator

## MAAS

```sh

# installing and setting up maas
sudo ./init_maas.sh

# removeing maas
sudo ./clear_maas.sh

```

## LXD

```sh

# installing and config lxd
sudo ./init_main_lxd.sh

# remove lxd
snap remove lxd


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
