// This file is auto-generated by @hey-api/openapi-ts

import type { Options } from '@hey-api/client-axios';
import { queryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { client, AdminService, BillingService, ClusterService, InstanceService, RootService, UserService } from '../services.gen';
import type { BillingTopUpData, BillingTopUpError, BillingTopUpResponse, ClusterCreateJoinTokenData, ClusterCreateJoinTokenError, ClusterCreateJoinTokenResponse, ClusterAddMemberData, ClusterAddMemberError, ClusterAddMemberResponse, InstanceGetInstanceData, InstanceCreateInstanceData, InstanceCreateInstanceError, InstanceCreateInstanceResponse, InstanceStartInstanceData, InstanceStartInstanceError, InstanceStartInstanceResponse, InstanceStopInstanceData, InstanceStopInstanceError, InstanceStopInstanceResponse, InstanceDeleteInstanceData, InstanceDeleteInstanceError, InstanceDeleteInstanceResponse, InstanceRestartInstanceData, InstanceRestartInstanceError, InstanceRestartInstanceResponse, UserCreateUserData, UserCreateUserError, UserCreateUserResponse, UserLoginUserData, UserLoginUserError, UserLoginUserResponse, UserLogoutUserError, UserLogoutUserResponse } from '../types.gen';
import type { AxiosError } from 'axios';

type QueryKey<TOptions extends Options> = [
    Pick<TOptions, 'baseURL' | 'body' | 'headers' | 'path' | 'query'> & {
        _id: string;
        _infinite?: boolean;
    }
];

const createQueryKey = <TOptions extends Options>(id: string, options?: TOptions, infinite?: boolean): QueryKey<TOptions>[0] => {
    const params: QueryKey<TOptions>[0] = { _id: id, baseURL: (options?.client ?? client).getConfig().baseURL } as QueryKey<TOptions>[0];
    if (infinite) {
        params._infinite = infinite;
    }
    if (options?.body) {
        params.body = options.body;
    }
    if (options?.headers) {
        params.headers = options.headers;
    }
    if (options?.path) {
        params.path = options.path;
    }
    if (options?.query) {
        params.query = options.query;
    }
    return params;
};

export const adminGetAllUsersQueryKey = (options?: Options) => [
    createQueryKey('adminGetAllUsers', options)
];

export const adminGetAllUsersOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await AdminService.adminGetAllUsers({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: adminGetAllUsersQueryKey(options)
    });
};

export const billingGetBillingOverviewQueryKey = (options?: Options) => [
    createQueryKey('billingGetBillingOverview', options)
];

export const billingGetBillingOverviewOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await BillingService.billingGetBillingOverview({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: billingGetBillingOverviewQueryKey(options)
    });
};

export const billingGetAllUserTransactionsQueryKey = (options?: Options) => [
    createQueryKey('billingGetAllUserTransactions', options)
];

export const billingGetAllUserTransactionsOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await BillingService.billingGetAllUserTransactions({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: billingGetAllUserTransactionsQueryKey(options)
    });
};

export const billingTopUpQueryKey = (options: Options<BillingTopUpData>) => [
    createQueryKey('billingTopUp', options)
];

export const billingTopUpOptions = (options: Options<BillingTopUpData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await BillingService.billingTopUp({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: billingTopUpQueryKey(options)
    });
};

export const billingTopUpMutation = (options?: Partial<Options<BillingTopUpData>>) => {
    const mutationOptions: UseMutationOptions<BillingTopUpResponse, AxiosError<BillingTopUpError>, Options<BillingTopUpData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await BillingService.billingTopUp({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const billingGetUserWalletQueryKey = (options?: Options) => [
    createQueryKey('billingGetUserWallet', options)
];

export const billingGetUserWalletOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await BillingService.billingGetUserWallet({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: billingGetUserWalletQueryKey(options)
    });
};

export const clusterCreateJoinTokenQueryKey = (options: Options<ClusterCreateJoinTokenData>) => [
    createQueryKey('clusterCreateJoinToken', options)
];

export const clusterCreateJoinTokenOptions = (options: Options<ClusterCreateJoinTokenData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await ClusterService.clusterCreateJoinToken({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: clusterCreateJoinTokenQueryKey(options)
    });
};

export const clusterCreateJoinTokenMutation = (options?: Partial<Options<ClusterCreateJoinTokenData>>) => {
    const mutationOptions: UseMutationOptions<ClusterCreateJoinTokenResponse, AxiosError<ClusterCreateJoinTokenError>, Options<ClusterCreateJoinTokenData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await ClusterService.clusterCreateJoinToken({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const clusterAddMemberQueryKey = (options: Options<ClusterAddMemberData>) => [
    createQueryKey('clusterAddMember', options)
];

export const clusterAddMemberOptions = (options: Options<ClusterAddMemberData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await ClusterService.clusterAddMember({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: clusterAddMemberQueryKey(options)
    });
};

export const clusterAddMemberMutation = (options?: Partial<Options<ClusterAddMemberData>>) => {
    const mutationOptions: UseMutationOptions<ClusterAddMemberResponse, AxiosError<ClusterAddMemberError>, Options<ClusterAddMemberData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await ClusterService.clusterAddMember({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const instanceInstanceDetailsQueryKey = (options?: Options) => [
    createQueryKey('instanceInstanceDetails', options)
];

export const instanceInstanceDetailsOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await InstanceService.instanceInstanceDetails({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: instanceInstanceDetailsQueryKey(options)
    });
};

export const instanceListInstancesQueryKey = (options?: Options) => [
    createQueryKey('instanceListInstances', options)
];

export const instanceListInstancesOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await InstanceService.instanceListInstances({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: instanceListInstancesQueryKey(options)
    });
};

export const instanceGetInstanceQueryKey = (options: Options<InstanceGetInstanceData>) => [
    createQueryKey('instanceGetInstance', options)
];

export const instanceGetInstanceOptions = (options: Options<InstanceGetInstanceData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await InstanceService.instanceGetInstance({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: instanceGetInstanceQueryKey(options)
    });
};

export const instanceCreateInstanceQueryKey = (options: Options<InstanceCreateInstanceData>) => [
    createQueryKey('instanceCreateInstance', options)
];

export const instanceCreateInstanceOptions = (options: Options<InstanceCreateInstanceData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await InstanceService.instanceCreateInstance({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: instanceCreateInstanceQueryKey(options)
    });
};

export const instanceCreateInstanceMutation = (options?: Partial<Options<InstanceCreateInstanceData>>) => {
    const mutationOptions: UseMutationOptions<InstanceCreateInstanceResponse, AxiosError<InstanceCreateInstanceError>, Options<InstanceCreateInstanceData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await InstanceService.instanceCreateInstance({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const instanceStartInstanceQueryKey = (options: Options<InstanceStartInstanceData>) => [
    createQueryKey('instanceStartInstance', options)
];

export const instanceStartInstanceOptions = (options: Options<InstanceStartInstanceData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await InstanceService.instanceStartInstance({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: instanceStartInstanceQueryKey(options)
    });
};

export const instanceStartInstanceMutation = (options?: Partial<Options<InstanceStartInstanceData>>) => {
    const mutationOptions: UseMutationOptions<InstanceStartInstanceResponse, AxiosError<InstanceStartInstanceError>, Options<InstanceStartInstanceData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await InstanceService.instanceStartInstance({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const instanceStopInstanceQueryKey = (options: Options<InstanceStopInstanceData>) => [
    createQueryKey('instanceStopInstance', options)
];

export const instanceStopInstanceOptions = (options: Options<InstanceStopInstanceData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await InstanceService.instanceStopInstance({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: instanceStopInstanceQueryKey(options)
    });
};

export const instanceStopInstanceMutation = (options?: Partial<Options<InstanceStopInstanceData>>) => {
    const mutationOptions: UseMutationOptions<InstanceStopInstanceResponse, AxiosError<InstanceStopInstanceError>, Options<InstanceStopInstanceData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await InstanceService.instanceStopInstance({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const instanceDeleteInstanceQueryKey = (options: Options<InstanceDeleteInstanceData>) => [
    createQueryKey('instanceDeleteInstance', options)
];

export const instanceDeleteInstanceOptions = (options: Options<InstanceDeleteInstanceData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await InstanceService.instanceDeleteInstance({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: instanceDeleteInstanceQueryKey(options)
    });
};

export const instanceDeleteInstanceMutation = (options?: Partial<Options<InstanceDeleteInstanceData>>) => {
    const mutationOptions: UseMutationOptions<InstanceDeleteInstanceResponse, AxiosError<InstanceDeleteInstanceError>, Options<InstanceDeleteInstanceData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await InstanceService.instanceDeleteInstance({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const instanceRestartInstanceQueryKey = (options: Options<InstanceRestartInstanceData>) => [
    createQueryKey('instanceRestartInstance', options)
];

export const instanceRestartInstanceOptions = (options: Options<InstanceRestartInstanceData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await InstanceService.instanceRestartInstance({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: instanceRestartInstanceQueryKey(options)
    });
};

export const instanceRestartInstanceMutation = (options?: Partial<Options<InstanceRestartInstanceData>>) => {
    const mutationOptions: UseMutationOptions<InstanceRestartInstanceResponse, AxiosError<InstanceRestartInstanceError>, Options<InstanceRestartInstanceData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await InstanceService.instanceRestartInstance({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const rootRootQueryKey = (options?: Options) => [
    createQueryKey('rootRoot', options)
];

export const rootRootOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await RootService.rootRoot({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: rootRootQueryKey(options)
    });
};

export const userCreateUserQueryKey = (options: Options<UserCreateUserData>) => [
    createQueryKey('userCreateUser', options)
];

export const userCreateUserOptions = (options: Options<UserCreateUserData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await UserService.userCreateUser({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: userCreateUserQueryKey(options)
    });
};

export const userCreateUserMutation = (options?: Partial<Options<UserCreateUserData>>) => {
    const mutationOptions: UseMutationOptions<UserCreateUserResponse, AxiosError<UserCreateUserError>, Options<UserCreateUserData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await UserService.userCreateUser({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const userLoginUserQueryKey = (options: Options<UserLoginUserData>) => [
    createQueryKey('userLoginUser', options)
];

export const userLoginUserOptions = (options: Options<UserLoginUserData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await UserService.userLoginUser({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: userLoginUserQueryKey(options)
    });
};

export const userLoginUserMutation = (options?: Partial<Options<UserLoginUserData>>) => {
    const mutationOptions: UseMutationOptions<UserLoginUserResponse, AxiosError<UserLoginUserError>, Options<UserLoginUserData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await UserService.userLoginUser({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const userGetUserSessionQueryKey = (options?: Options) => [
    createQueryKey('userGetUserSession', options)
];

export const userGetUserSessionOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await UserService.userGetUserSession({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: userGetUserSessionQueryKey(options)
    });
};

export const userLogoutUserQueryKey = (options?: Options) => [
    createQueryKey('userLogoutUser', options)
];

export const userLogoutUserOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await UserService.userLogoutUser({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: userLogoutUserQueryKey(options)
    });
};

export const userLogoutUserMutation = (options?: Partial<Options>) => {
    const mutationOptions: UseMutationOptions<UserLogoutUserResponse, AxiosError<UserLogoutUserError>, Options> = {
        mutationFn: async (localOptions) => {
            const { data } = await UserService.userLogoutUser({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};