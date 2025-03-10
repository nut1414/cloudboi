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
        os_image_name: "CentOS",
        os_image_version: "7.9"
      },
      {
        os_type_id: 4,
        os_image_name: "CentOS",
        os_image_version: "8 Stream"
      },
      {
        os_type_id: 5,
        os_image_name: "Debian",
        os_image_version: "10"
      },
      {
        os_type_id: 6,
        os_image_name: "Debian",
        os_image_version: "11"
      },
      {
        os_type_id: 7,
        os_image_name: "Windows",
        os_image_version: "Server 2019"
      },
      {
        os_type_id: 8,
        os_image_name: "Windows",
        os_image_version: "Server 2022"
      }
    ]
  }
  