
### Cloud-init Generator for onboarding new lxd cluster

Node are deployed with installation of lxd and jq and iptables

Node newly deployed are expected to call "backend" server to get lxd cluster join token by using curl with body server_name that has node's hostname

```sh
NODE_HOSTNAME=$(hostname)
NODE_IP=$(hostname -I | awk '{print $1}')


JSON_BODY =$(curl -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"server_name": "$NODE_HOSTNAME"}' \
  http://10.10.10.2:8000/internal/cluster/create_token)
```

Result from the curl will be pipe into `jq` to be store as variable

```sh
JOIN_TOKEN = $($JSON_BODY | jq -r '.join_token')
```

using the result join_token, setup lxd config. after that it will be calling backend again to join the resource group



```sh
##
# ... auto unitialize LXD with NODE_IP and join token ... 
# ... finished ...
##

## Calling api endpoint to join resource group

curl -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"server_name": "$NODE_HOSTNAME"}' \
  http://10.10.10.2:8000/internal/add_member
```

