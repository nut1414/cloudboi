import { BaseInstanceState, NetworkInterface, NetworkAddress, ClusterMemberState, ClusterMemberInfo, ClusterGetMembersStateResponse } from "../client"

interface NetworkInfo {
    ipv4: string | null
    ipv6: string | null
}

interface ResourceUsage {
    used: number
    total: number
    percentage: number
}

interface InstanceStateInfo {
    network: {
        main: NetworkInfo
    }
    memory: ResourceUsage
    cpu: {
        usage: number
        cores: number
    }
}

interface ClusterMemberStateInfo {
    server_name: string
    status: string
    roles: string[]
    groups: string[]
    total_ram: number
    free_ram: number
    percentage_ram: number
    load_one: number
    load_five: number
    load_fifteen: number
    percentage_cpu: number
    logical_cpus: number
    local_space_total: number
    local_space_used: number
    local_space_percentage: number
    is_leader: boolean
}

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

export const getNetworkAddresses = (networkInterface: NetworkInterface): NetworkInfo => {
    const addresses = networkInterface?.addresses || []
    return {
        ipv4: addresses.find(addr => addr.family === "inet")?.address || null,
        ipv6: addresses.find(addr => addr.family === "inet6")?.address || null
    }
}

export const formatResourceUsage = (used: number, total: number): string => {
    if (!used || !total) return "0%"
    return `${Math.round((used / total) * 100)}%`
}

export const parseInstanceState = (state: BaseInstanceState): InstanceStateInfo => {
    // Network Information
    const mainInterface = state.network?.eth0

    const network = {
        main: mainInterface ? getNetworkAddresses(mainInterface) : { ipv4: null, ipv6: null },
    }

    // Memory Usage
    const memory = {
        used: state.memory.usage,
        total: state.memory.total,
        percentage: (state.memory.usage / state.memory.total) * 100
    }

    // CPU Information
    const cpu = {
        usage: state.cpu.usage,
        cores: state.cpu.cores
    }

    return {
        network,
        memory,
        cpu
    }
}

// Helper functions for formatted display
export const getFormattedMemoryInfo = (memory: ResourceUsage): string => {
    return `${formatResourceUsage(memory.used, memory.total)} (${formatBytes(memory.used)} / ${formatBytes(memory.total)})`
}

export const getFormattedCPUInfo = (cpu: { usage: number; cores: number }): string => {
    return `${cpu.usage.toFixed(1)}% (${cpu.cores} core${cpu.cores > 1 ? 's' : ''})`
}

export const getFormattedNetworkInfo = (network: NetworkInfo): string => {
    return `IPv4: ${network.ipv4 || 'N/A'}\nIPv6: ${network.ipv6 || 'N/A'}`
} 

export const groupClusterMemberStateInfo = (response: ClusterGetMembersStateResponse): ClusterMemberStateInfo[] => {
  return response.members_infos.map((info) => {
    const state = response.members_states.find((state) => state.server_name === info.server_name)
    if (!state) return {
        server_name: info.server_name,
        status: info.status, 
        roles: info.roles,
        groups: info.groups,
        total_ram: 0,
        free_ram: 0,
        percentage_ram: 0,
        load_one: 0,
        load_five: 0,
        load_fifteen: 0,
        percentage_cpu: 0,
        logical_cpus: 0,
        local_space_total: 0,
        local_space_used: 0,
        local_space_percentage: 0,
        is_leader: false
    }

    const total_ram = state.sysinfo.total_ram;
    const free_ram = state.sysinfo.free_ram;
    const used_ram = total_ram - free_ram;
    const percentage_ram = total_ram > 0 ? (used_ram / total_ram) * 100 : 0;
    const load_one = state.sysinfo.load_averages?.[0] || 0;
    const load_five = state.sysinfo.load_averages?.[1] || 0;
    const load_fifteen = state.sysinfo.load_averages?.[2] || 0;
    const percentage_cpu = load_one * 100 / state.sysinfo.logical_cpus;
    const local_space_total = state.storage_pools?.local?.space?.total || 0;
    const local_space_used = state.storage_pools?.local?.space?.used || 0;
    const local_space_percentage = local_space_total > 0 ? (local_space_used / local_space_total) * 100 : 0;
    const is_leader = response.members_leader === info.server_name;
    
    return {
        server_name: info.server_name,
        status: info.status, 
        roles: info.roles,
        groups: info.groups,
        total_ram: total_ram,
        free_ram: free_ram,
        percentage_ram: percentage_ram,
        load_one: load_one,
        load_five: load_five,
        load_fifteen: load_fifteen,
        percentage_cpu: percentage_cpu,
        logical_cpus: state.sysinfo.logical_cpus,
        local_space_total: local_space_total,
        local_space_used: local_space_used,
        local_space_percentage: local_space_percentage,
        is_leader: is_leader
    }
  })
}