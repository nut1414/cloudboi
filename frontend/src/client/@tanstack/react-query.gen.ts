// This file is auto-generated by @hey-api/openapi-ts

import type { Options } from '@hey-api/client-axios';
import { queryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { client, AdminService, BillingService, ClusterService, InstanceService, RootService, UserService } from '../services.gen';
<<<<<<< HEAD
import type { AdminCreateInstancePlanData, AdminCreateInstancePlanError, AdminCreateInstancePlanResponse, AdminUpdateInstancePlanData, AdminUpdateInstancePlanError, AdminUpdateInstancePlanResponse, AdminDeleteInstancePlanData, AdminDeleteInstancePlanError, AdminDeleteInstancePlanResponse, AdminGetBillingStatsData, BillingGetBillingOverviewData, BillingGetAllUserTransactionsData, BillingTopUpData, BillingTopUpError, BillingTopUpResponse, BillingGetUserWalletData, ClusterCreateJoinTokenData, ClusterCreateJoinTokenError, ClusterCreateJoinTokenResponse, ClusterAddMemberData, ClusterAddMemberError, ClusterAddMemberResponse, InstanceListInstancesData, InstanceGetInstanceData, InstanceCreateInstanceData, InstanceCreateInstanceError, InstanceCreateInstanceResponse, InstanceStartInstanceData, InstanceStartInstanceError, InstanceStartInstanceResponse, InstanceStopInstanceData, InstanceStopInstanceError, InstanceStopInstanceResponse, InstanceDeleteInstanceData, InstanceDeleteInstanceError, InstanceDeleteInstanceResponse, InstanceRestartInstanceData, InstanceRestartInstanceError, InstanceRestartInstanceResponse, InstanceGetInstanceConsoleBufferData, InstanceGetInstanceStateData, InstanceResetInstancePasswordData, InstanceResetInstancePasswordError, InstanceResetInstancePasswordResponse, UserCreateUserData, UserCreateUserError, UserCreateUserResponse, UserLoginUserData, UserLoginUserError, UserLoginUserResponse, UserLogoutUserError, UserLogoutUserResponse } from '../types.gen';
=======
import type { AdminCreateInstancePlanData, AdminCreateInstancePlanError, AdminCreateInstancePlanResponse, AdminUpdateInstancePlanData, AdminUpdateInstancePlanError, AdminUpdateInstancePlanResponse, AdminDeleteInstancePlanData, AdminDeleteInstancePlanError, AdminDeleteInstancePlanResponse, AdminGetBillingStatsData, AdminTopupData, AdminTopupError, AdminTopupResponse, BillingGetBillingOverviewData, BillingGetAllUserTransactionsData, BillingTopUpData, BillingTopUpError, BillingTopUpResponse, BillingGetUserWalletData, ClusterCreateJoinTokenData, ClusterCreateJoinTokenError, ClusterCreateJoinTokenResponse, ClusterAddMemberData, ClusterAddMemberError, ClusterAddMemberResponse, InstanceListInstancesData, InstanceGetInstanceData, InstanceCreateInstanceData, InstanceCreateInstanceError, InstanceCreateInstanceResponse, InstanceStartInstanceData, InstanceStartInstanceError, InstanceStartInstanceResponse, InstanceStopInstanceData, InstanceStopInstanceError, InstanceStopInstanceResponse, InstanceDeleteInstanceData, InstanceDeleteInstanceError, InstanceDeleteInstanceResponse, InstanceRestartInstanceData, InstanceRestartInstanceError, InstanceRestartInstanceResponse, InstanceGetInstanceStateData, UserCreateUserData, UserCreateUserError, UserCreateUserResponse, UserLoginUserData, UserLoginUserError, UserLoginUserResponse, UserLogoutUserError, UserLogoutUserResponse } from '../types.gen';
>>>>>>> cafd677 (add admin topup backend)
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

export const adminGetInstancePlansQueryKey = (options?: Options) => [
    createQueryKey('adminGetInstancePlans', options)
];

export const adminGetInstancePlansOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await AdminService.adminGetInstancePlans({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: adminGetInstancePlansQueryKey(options)
    });
};

export const adminCreateInstancePlanQueryKey = (options: Options<AdminCreateInstancePlanData>) => [
    createQueryKey('adminCreateInstancePlan', options)
];

export const adminCreateInstancePlanOptions = (options: Options<AdminCreateInstancePlanData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await AdminService.adminCreateInstancePlan({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: adminCreateInstancePlanQueryKey(options)
    });
};

export const adminCreateInstancePlanMutation = (options?: Partial<Options<AdminCreateInstancePlanData>>) => {
    const mutationOptions: UseMutationOptions<AdminCreateInstancePlanResponse, AxiosError<AdminCreateInstancePlanError>, Options<AdminCreateInstancePlanData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await AdminService.adminCreateInstancePlan({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const adminUpdateInstancePlanMutation = (options?: Partial<Options<AdminUpdateInstancePlanData>>) => {
    const mutationOptions: UseMutationOptions<AdminUpdateInstancePlanResponse, AxiosError<AdminUpdateInstancePlanError>, Options<AdminUpdateInstancePlanData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await AdminService.adminUpdateInstancePlan({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const adminDeleteInstancePlanMutation = (options?: Partial<Options<AdminDeleteInstancePlanData>>) => {
    const mutationOptions: UseMutationOptions<AdminDeleteInstancePlanResponse, AxiosError<AdminDeleteInstancePlanError>, Options<AdminDeleteInstancePlanData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await AdminService.adminDeleteInstancePlan({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const adminGetBillingStatsQueryKey = (options: Options<AdminGetBillingStatsData>) => [
    createQueryKey('adminGetBillingStats', options)
];

export const adminGetBillingStatsOptions = (options: Options<AdminGetBillingStatsData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await AdminService.adminGetBillingStats({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: adminGetBillingStatsQueryKey(options)
    });
};

export const adminGetAllTransactionsQueryKey = (options?: Options) => [
    createQueryKey('adminGetAllTransactions', options)
];

export const adminGetAllTransactionsOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await AdminService.adminGetAllTransactions({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: adminGetAllTransactionsQueryKey(options)
    });
};

export const adminTopupQueryKey = (options: Options<AdminTopupData>) => [
    createQueryKey('adminTopup', options)
];

export const adminTopupOptions = (options: Options<AdminTopupData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await AdminService.adminTopup({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: adminTopupQueryKey(options)
    });
};

export const adminTopupMutation = (options?: Partial<Options<AdminTopupData>>) => {
    const mutationOptions: UseMutationOptions<AdminTopupResponse, AxiosError<AdminTopupError>, Options<AdminTopupData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await AdminService.adminTopup({
                ...options,
                ...localOptions,
                throwOnError: true
            });
            return data;
        }
    };
    return mutationOptions;
};

export const billingGetBillingOverviewQueryKey = (options: Options<BillingGetBillingOverviewData>) => [
    createQueryKey('billingGetBillingOverview', options)
];

export const billingGetBillingOverviewOptions = (options: Options<BillingGetBillingOverviewData>) => {
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

export const billingGetAllUserTransactionsQueryKey = (options: Options<BillingGetAllUserTransactionsData>) => [
    createQueryKey('billingGetAllUserTransactions', options)
];

export const billingGetAllUserTransactionsOptions = (options: Options<BillingGetAllUserTransactionsData>) => {
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

export const billingGetUserWalletQueryKey = (options: Options<BillingGetUserWalletData>) => [
    createQueryKey('billingGetUserWallet', options)
];

export const billingGetUserWalletOptions = (options: Options<BillingGetUserWalletData>) => {
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

export const clusterGetMembersStateQueryKey = (options?: Options) => [
    createQueryKey('clusterGetMembersState', options)
];

export const clusterGetMembersStateOptions = (options?: Options) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await ClusterService.clusterGetMembersState({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: clusterGetMembersStateQueryKey(options)
    });
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

export const instanceListInstancesQueryKey = (options: Options<InstanceListInstancesData>) => [
    createQueryKey('instanceListInstances', options)
];

export const instanceListInstancesOptions = (options: Options<InstanceListInstancesData>) => {
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

export const instanceGetInstanceConsoleBufferQueryKey = (options: Options<InstanceGetInstanceConsoleBufferData>) => [
    createQueryKey('instanceGetInstanceConsoleBuffer', options)
];

export const instanceGetInstanceConsoleBufferOptions = (options: Options<InstanceGetInstanceConsoleBufferData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await InstanceService.instanceGetInstanceConsoleBuffer({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: instanceGetInstanceConsoleBufferQueryKey(options)
    });
};

export const instanceGetInstanceStateQueryKey = (options: Options<InstanceGetInstanceStateData>) => [
    createQueryKey('instanceGetInstanceState', options)
];

export const instanceGetInstanceStateOptions = (options: Options<InstanceGetInstanceStateData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await InstanceService.instanceGetInstanceState({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: instanceGetInstanceStateQueryKey(options)
    });
};

export const instanceResetInstancePasswordQueryKey = (options: Options<InstanceResetInstancePasswordData>) => [
    createQueryKey('instanceResetInstancePassword', options)
];

export const instanceResetInstancePasswordOptions = (options: Options<InstanceResetInstancePasswordData>) => {
    return queryOptions({
        queryFn: async ({ queryKey, signal }) => {
            const { data } = await InstanceService.instanceResetInstancePassword({
                ...options,
                ...queryKey[0],
                signal,
                throwOnError: true
            });
            return data;
        },
        queryKey: instanceResetInstancePasswordQueryKey(options)
    });
};

export const instanceResetInstancePasswordMutation = (options?: Partial<Options<InstanceResetInstancePasswordData>>) => {
    const mutationOptions: UseMutationOptions<InstanceResetInstancePasswordResponse, AxiosError<InstanceResetInstancePasswordError>, Options<InstanceResetInstancePasswordData>> = {
        mutationFn: async (localOptions) => {
            const { data } = await InstanceService.instanceResetInstancePassword({
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