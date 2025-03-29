import { InstanceDetails } from "../tmp/type";

export const placeholderInstanceDetails: InstanceDetails = {
    instance_package: [
      {
        instance_type_id: 1,
        instance_package_name: "Small",
        vcpu_amount: 1,
        ram_amount: 2,
        storage_amount: 20,
        cost_hour: 0.015
      },
      {
        instance_type_id: 2,
        instance_package_name: "Medium",
        vcpu_amount: 2,
        ram_amount: 4,
        storage_amount: 40,
        cost_hour: 0.030
      },
      {
        instance_type_id: 3,
        instance_package_name: "Large",
        vcpu_amount: 4,
        ram_amount: 8,
        storage_amount: 80,
        cost_hour: 0.060
      },
      {
        instance_type_id: 4,
        instance_package_name: "Extra Large",
        vcpu_amount: 8,
        ram_amount: 16,
        storage_amount: 160,
        cost_hour: 0.120
      }
    ],
    os_image: [
      {
        os_type_id: 1,
        os_image_name: "Ubuntu",
        os_image_version: "20.04 LTS"
      },
      {
        os_type_id: 2,
        os_image_name: "Ubuntu",
        os_image_version: "22.04 LTS"
      },
      {
        os_type_id: 3,
        os_image_name: "Debian",
        os_image_version: "10"
      },
      {
        os_type_id: 4,
        os_image_name: "Debian",
        os_image_version: "11"
      }
    ]
  }
  
  export const UserInstances = [
    { name: "instance_01", os: "Debian xx.xx.xx", usage: "8.23 GBs", type: "Instance Type 1", status: "Running" },
    { name: "instance_02", os: "Ubuntu xx.xx.xx", usage: "5.15 GBs", type: "Instance Type 1", status: "Stopped" },
    { name: "instance_03", os: "CentOS xx.xx.xx", usage: "12.45 GBs", type: "Instance Type 2", status: "Running" },
    { name: "instance_04", os: "Fedora xx.xx.xx", usage: "3.89 GBs", type: "Instance Type 3", status: "Stopped" },
    { name: "instance_05", os: "Arch Linux xx.xx.xx", usage: "6.78 GBs", type: "Instance Type 2", status: "Running" },
    { name: "instance_06", os: "Alpine Linux xx.xx.xx", usage: "2.34 GBs", type: "Instance Type 1", status: "Stopped" },
    { name: "instance_07", os: "Rocky Linux xx.xx.xx", usage: "9.67 GBs", type: "Instance Type 3", status: "Running" },
    { name: "instance_08", os: "OpenSUSE xx.xx.xx", usage: "7.45 GBs", type: "Instance Type 2", status: "Stopped" },
    { name: "instance_09", os: "Kali Linux xx.xx.xx", usage: "4.56 GBs", type: "Instance Type 1", status: "Running" },
    { name: "instance_10", os: "Debian xx.xx.xx", usage: "10.12 GBs", type: "Instance Type 2", status: "Stopped" },
    { name: "instance_11", os: "Ubuntu xx.xx.xx", usage: "11.34 GBs", type: "Instance Type 1", status: "Running" },
    { name: "instance_12", os: "CentOS xx.xx.xx", usage: "8.99 GBs", type: "Instance Type 2", status: "Stopped" },
    { name: "instance_13", os: "Fedora xx.xx.xx", usage: "3.12 GBs", type: "Instance Type 3", status: "Running" },
    { name: "instance_14", os: "Arch Linux xx.xx.xx", usage: "5.87 GBs", type: "Instance Type 2", status: "Stopped" },
    { name: "instance_15", os: "Alpine Linux xx.xx.xx", usage: "2.98 GBs", type: "Instance Type 1", status: "Running" },
    { name: "instance_16", os: "Rocky Linux xx.xx.xx", usage: "9.31 GBs", type: "Instance Type 3", status: "Stopped" },
    { name: "instance_17", os: "OpenSUSE xx.xx.xx", usage: "6.75 GBs", type: "Instance Type 2", status: "Running" },
    { name: "instance_18", os: "Kali Linux xx.xx.xx", usage: "7.89 GBs", type: "Instance Type 1", status: "Stopped" },
    { name: "instance_19", os: "Debian xx.xx.xx", usage: "10.56 GBs", type: "Instance Type 2", status: "Running" },
    { name: "instance_20", os: "Ubuntu xx.xx.xx", usage: "4.21 GBs", type: "Instance Type 1", status: "Stopped" },
    { name: "instance_21", os: "CentOS xx.xx.xx", usage: "11.78 GBs", type: "Instance Type 2", status: "Running" },
    { name: "instance_22", os: "Fedora xx.xx.xx", usage: "6.34 GBs", type: "Instance Type 3", status: "Stopped" },
    { name: "instance_23", os: "Arch Linux xx.xx.xx", usage: "9.01 GBs", type: "Instance Type 2", status: "Running" },
    { name: "instance_24", os: "Alpine Linux xx.xx.xx", usage: "3.65 GBs", type: "Instance Type 1", status: "Stopped" },
    { name: "instance_25", os: "Rocky Linux xx.xx.xx", usage: "8.43 GBs", type: "Instance Type 3", status: "Running" },
    { name: "instance_26", os: "OpenSUSE xx.xx.xx", usage: "7.99 GBs", type: "Instance Type 2", status: "Stopped" },
    { name: "instance_27", os: "Kali Linux xx.xx.xx", usage: "5.22 GBs", type: "Instance Type 1", status: "Running" },
    { name: "instance_28", os: "Debian xx.xx.xx", usage: "12.11 GBs", type: "Instance Type 2", status: "Stopped" },
    { name: "instance_29", os: "Ubuntu xx.xx.xx", usage: "3.88 GBs", type: "Instance Type 1", status: "Running" },
    { name: "instance_30", os: "CentOS xx.xx.xx", usage: "10.44 GBs", type: "Instance Type 2", status: "Stopped" },
];