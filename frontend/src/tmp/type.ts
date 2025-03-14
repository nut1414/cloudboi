// src/types/instance.ts
export interface BaseModel {}

export type InstanceStatus = "Running" | "Stopped"; // Define allowed statuses

export interface InstanceType extends BaseModel {
    instance_type_id: number;
    instance_package_name: string;
    vcpu_amount: number;
    ram_amount: number;
    storage_amount: number;
    cost_hour: number;
}

export interface OsType extends BaseModel {
    os_type_id: number;
    os_image_name: string;
    os_image_version: string;
}

export interface InstanceDetails extends BaseModel {
    instance_package: InstanceType[];
    os_image: OsType[];
}

export interface InstanceCreateRequest extends BaseModel {
    os_type: OsType;
    instance_type: InstanceType;
    instance_name: string;
    root_password: string;
}

export interface InstanceCreateResponse extends BaseModel {
    instance_name: string;
    instance_status: string;
    created_at: string;
}


// New: Instance model for Manage page
export interface Instance extends BaseModel {
    id: string;
    name: string;
    os: string;
    usage: string;
    type: string;
    status: InstanceStatus;
}


export interface BillingItem extends BaseModel {
    date: string;
    description: string;
    amount: string;
}



//*****admin ******


// PackageData can also live here if it's related to your instance/domain
export interface PackageData extends BaseModel {
    id: string;
    name: string;
    type: number;
    price: number;
    cpu: number;
    ram: number;
    storage: number;
  }