import { BaseInstanceState, NetworkInterface, NetworkAddress } from "../client"

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