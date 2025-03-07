// src/types/instance.ts
export interface BaseModel {}

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