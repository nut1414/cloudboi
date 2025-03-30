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