// This file is auto-generated by @hey-api/openapi-ts

import { createClient, createConfig, type Options } from '@hey-api/client-axios';
import { type AdminGetAllUsersError, type AdminGetAllUsersResponse, AdminGetAllUsersResponseTransformer, type BillingGetBillingOverviewError, type BillingGetBillingOverviewResponse, type BillingGetAllUserTransactionsError, type BillingGetAllUserTransactionsResponse, type BillingTopUpData, type BillingTopUpError, type BillingTopUpResponse, type BillingGetUserWalletError, type BillingGetUserWalletResponse, type ClusterCreateJoinTokenData, type ClusterCreateJoinTokenError, type ClusterCreateJoinTokenResponse, type ClusterAddMemberData, type ClusterAddMemberError, type ClusterAddMemberResponse, type InstanceInstanceDetailsError, type InstanceInstanceDetailsResponse, type InstanceListInstancesError, type InstanceListInstancesResponse, type InstanceGetInstanceData, type InstanceGetInstanceError, type InstanceGetInstanceResponse, type InstanceCreateInstanceData, type InstanceCreateInstanceError, type InstanceCreateInstanceResponse, type InstanceStartInstanceData, type InstanceStartInstanceError, type InstanceStartInstanceResponse, type InstanceStopInstanceData, type InstanceStopInstanceError, type InstanceStopInstanceResponse, type InstanceDeleteInstanceData, type InstanceDeleteInstanceError, type InstanceDeleteInstanceResponse, type InstanceRestartInstanceData, type InstanceRestartInstanceError, type InstanceRestartInstanceResponse, InstanceListInstancesResponseTransformer, InstanceGetInstanceResponseTransformer, InstanceCreateInstanceResponseTransformer, type RootRootError, type RootRootResponse, type UserCreateUserData, type UserCreateUserError, type UserCreateUserResponse, type UserLoginUserData, type UserLoginUserError, type UserLoginUserResponse, type UserGetUserSessionError, type UserGetUserSessionResponse, type UserLogoutUserError, type UserLogoutUserResponse, UserCreateUserResponseTransformer } from './types.gen';

export const client = createClient(createConfig());

export class AdminService {
    /**
     * Get All Users
     */
    public static adminGetAllUsers<ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) {
        return (options?.client ?? client).get<AdminGetAllUsersResponse, AdminGetAllUsersError, ThrowOnError>({
            ...options,
            url: '/admin/users',
            responseTransformer: AdminGetAllUsersResponseTransformer
        });
    }
    
}

export class BillingService {
    /**
     * Get Billing Overview
     */
    public static billingGetBillingOverview<ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) {
        return (options?.client ?? client).get<BillingGetBillingOverviewResponse, BillingGetBillingOverviewError, ThrowOnError>({
            ...options,
            url: '/billing/overview'
        });
    }
    
    /**
     * Get All User Transactions
     */
    public static billingGetAllUserTransactions<ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) {
        return (options?.client ?? client).get<BillingGetAllUserTransactionsResponse, BillingGetAllUserTransactionsError, ThrowOnError>({
            ...options,
            url: '/billing/transactions'
        });
    }
    
    /**
     * Top Up
     */
    public static billingTopUp<ThrowOnError extends boolean = false>(options: Options<BillingTopUpData, ThrowOnError>) {
        return (options?.client ?? client).post<BillingTopUpResponse, BillingTopUpError, ThrowOnError>({
            ...options,
            url: '/billing/topup'
        });
    }
    
    /**
     * Get User Wallet
     */
    public static billingGetUserWallet<ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) {
        return (options?.client ?? client).get<BillingGetUserWalletResponse, BillingGetUserWalletError, ThrowOnError>({
            ...options,
            url: '/billing/wallet'
        });
    }
    
}

export class ClusterService {
    /**
     * Create Join Token
     */
    public static clusterCreateJoinToken<ThrowOnError extends boolean = false>(options: Options<ClusterCreateJoinTokenData, ThrowOnError>) {
        return (options?.client ?? client).post<ClusterCreateJoinTokenResponse, ClusterCreateJoinTokenError, ThrowOnError>({
            ...options,
            url: '/internal/cluster/create_token'
        });
    }
    
    /**
     * Add Member
     */
    public static clusterAddMember<ThrowOnError extends boolean = false>(options: Options<ClusterAddMemberData, ThrowOnError>) {
        return (options?.client ?? client).post<ClusterAddMemberResponse, ClusterAddMemberError, ThrowOnError>({
            ...options,
            url: '/internal/cluster/add_member'
        });
    }
    
}

export class InstanceService {
    /**
     * Instance Details
     */
    public static instanceInstanceDetails<ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) {
        return (options?.client ?? client).get<InstanceInstanceDetailsResponse, InstanceInstanceDetailsError, ThrowOnError>({
            ...options,
            url: '/instance/details'
        });
    }
    
    /**
     * List Instances
     */
    public static instanceListInstances<ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) {
        return (options?.client ?? client).get<InstanceListInstancesResponse, InstanceListInstancesError, ThrowOnError>({
            ...options,
            url: '/instance/list',
            responseTransformer: InstanceListInstancesResponseTransformer
        });
    }
    
    /**
     * Get Instance
     */
    public static instanceGetInstance<ThrowOnError extends boolean = false>(options: Options<InstanceGetInstanceData, ThrowOnError>) {
        return (options?.client ?? client).get<InstanceGetInstanceResponse, InstanceGetInstanceError, ThrowOnError>({
            ...options,
            url: '/instance/{instance_name}',
            responseTransformer: InstanceGetInstanceResponseTransformer
        });
    }
    
    /**
     * Create Instance
     */
    public static instanceCreateInstance<ThrowOnError extends boolean = false>(options: Options<InstanceCreateInstanceData, ThrowOnError>) {
        return (options?.client ?? client).post<InstanceCreateInstanceResponse, InstanceCreateInstanceError, ThrowOnError>({
            ...options,
            url: '/instance/create',
            responseTransformer: InstanceCreateInstanceResponseTransformer
        });
    }
    
    /**
     * Start Instance
     */
    public static instanceStartInstance<ThrowOnError extends boolean = false>(options: Options<InstanceStartInstanceData, ThrowOnError>) {
        return (options?.client ?? client).post<InstanceStartInstanceResponse, InstanceStartInstanceError, ThrowOnError>({
            ...options,
            url: '/instance/{instance_name}/start'
        });
    }
    
    /**
     * Stop Instance
     */
    public static instanceStopInstance<ThrowOnError extends boolean = false>(options: Options<InstanceStopInstanceData, ThrowOnError>) {
        return (options?.client ?? client).post<InstanceStopInstanceResponse, InstanceStopInstanceError, ThrowOnError>({
            ...options,
            url: '/instance/{instance_name}/stop'
        });
    }
    
    /**
     * Delete Instance
     */
    public static instanceDeleteInstance<ThrowOnError extends boolean = false>(options: Options<InstanceDeleteInstanceData, ThrowOnError>) {
        return (options?.client ?? client).post<InstanceDeleteInstanceResponse, InstanceDeleteInstanceError, ThrowOnError>({
            ...options,
            url: '/instance/{instance_name}/delete'
        });
    }
    
    /**
     * Restart Instance
     */
    public static instanceRestartInstance<ThrowOnError extends boolean = false>(options: Options<InstanceRestartInstanceData, ThrowOnError>) {
        return (options?.client ?? client).post<InstanceRestartInstanceResponse, InstanceRestartInstanceError, ThrowOnError>({
            ...options,
            url: '/instance/{instance_name}/restart'
        });
    }
    
}

export class RootService {
    /**
     * Root
     */
    public static rootRoot<ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) {
        return (options?.client ?? client).get<RootRootResponse, RootRootError, ThrowOnError>({
            ...options,
            url: '/'
        });
    }
    
}

export class UserService {
    /**
     * Create User
     */
    public static userCreateUser<ThrowOnError extends boolean = false>(options: Options<UserCreateUserData, ThrowOnError>) {
        return (options?.client ?? client).post<UserCreateUserResponse, UserCreateUserError, ThrowOnError>({
            ...options,
            url: '/user/register',
            responseTransformer: UserCreateUserResponseTransformer
        });
    }
    
    /**
     * Login User
     */
    public static userLoginUser<ThrowOnError extends boolean = false>(options: Options<UserLoginUserData, ThrowOnError>) {
        return (options?.client ?? client).post<UserLoginUserResponse, UserLoginUserError, ThrowOnError>({
            ...options,
            url: '/user/login'
        });
    }
    
    /**
     * Get User Session
     */
    public static userGetUserSession<ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) {
        return (options?.client ?? client).get<UserGetUserSessionResponse, UserGetUserSessionError, ThrowOnError>({
            ...options,
            url: '/user/session'
        });
    }
    
    /**
     * Logout User
     */
    public static userLogoutUser<ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) {
        return (options?.client ?? client).post<UserLogoutUserResponse, UserLogoutUserError, ThrowOnError>({
            ...options,
            url: '/user/logout'
        });
    }
    
}