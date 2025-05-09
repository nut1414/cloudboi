# CloudBoi Infrastructure Management

## Usage

The `cloudboi-cli` tool provides a unified interface for managing the infrastructure. Here are the available commands:

### Initialize MAAS

```bash
sudo ./cloudboi-cli init-maas [options]
```

Options:
- `--username`: MAAS admin username (default: admin)
- `--password`: MAAS admin password (default: admin)
- `--email`: MAAS admin email (default: admin@example.com)
- `--force`: Skip confirmation prompts and use default values

MAAS will be accessible at `https://yourip:5240/MAAS`

> **Important**: Make sure to stop MAAS service before initializing LXD:
> ```bash
> snap stop maas
> ```
> This is necessary because MAAS includes its own LXD, and overlapping subnet usage will break the LXD initialization.

### Initialize LXD Cluster

```bash
sudo ./cloudboi-cli init-lxd [options]
```

Options:
- `--channel`: LXD snap channel (default: 5.21/stable)
- `--force`: Skip confirmation prompts

LXD will be accessible at `https://yourip:8443`

#### LXD Cluster Configuration Details

The initialization process will automatically configure:
1. 'yes' - Use LXD Cluster
2. '' - Use default ip name
3. 'no' - Not joining an existing cluster
4. 'cloudboi-main' - Cluster name
5. 'yes' - Configure new storage pool
6. 'dir' - Storage pool name
7. 'no' - Don't use remote storage
8. 'no' - Don't connect to MAAS
9. 'no' - Use existing bridge/interface
10. 'yes' - Create a new fan overlay network
11. '' - Auto subnet for fan overlay network
12. 'yes' - Stale cached image
13. 'yes' - Print yaml

> **Note**: While LXD can be accessed via browser at `https://yourip:8443`, this is not required. All operations can be performed using the `lxc` command-line tool.

For connection with pylxd client, refer to the documentation:
https://pylxd.readthedocs.io/en/latest/authentication.html#generate-a-certificate

### Generate Cloud-init Configuration

```bash
sudo ./cloudboi-cli gen-cloudinit [--hostname node_hostname]
```

This command generates a cloud-init configuration for onboarding new nodes into the LXD cluster. If no hostname is provided, the script will prompt for input.

#### Generated cloud-init.yaml Features

1. System updates and upgrades
2. Creates `/usr/local/bin/setup-lxd.sh` that:
   - Removes existing LXD installation
   - Installs LXD via snap
   - Initializes LXD with join token (automatically answers prompts)
   - Sets up dnsmasq hosts directory permissions
   - Joins the node to the cloudboi-resource group

#### Join Token Generation

The script automatically generates a join token using:
```bash
JOIN_TOKEN=$(lxc cluster add $NODE_HOSTNAME | grep -E '^[A-Za-z0-9+/]+={0,2}$')
```

### Clear MAAS

```bash
sudo ./cloudboi-cli clear-maas [--force]
```

Removes MAAS and all its dependencies. The `--force` option will skip confirmation prompts.

### Clear LXD

```bash
sudo ./cloudboi-cli clear-lxd [--force]
```

Removes LXD and all its dependencies. The `--force` option will skip confirmation prompts.

### Clear System

```bash
sudo ./cloudboi-cli clear-system [--force]
```

Removes both MAAS and LXD from the system. The `--force` option will skip confirmation prompts.

### Install

```bash
sudo ./cloudboi-cli install [options]
```

Installs both MAAS and LXD with the specified options. This command combines `init-maas` and `init-lxd` into a single operation.

Options:
- `--username`: MAAS admin username (default: admin)
- `--password`: MAAS admin password (default: admin)
- `--email`: MAAS admin email (default: admin@example.com)
- `--channel`: LXD snap channel (default: 5.21/stable)
- `--force`: Skip confirmation prompts and use default values

## Help

To see available commands and options:

```bash
./cloudboi-cli help
```