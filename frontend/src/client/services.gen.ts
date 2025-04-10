// This file is auto-generated by @hey-api/openapi-ts

import { createClient, createConfig, type Options } from '@hey-api/client-axios';
<<<<<<< HEAD
import { type AdminGetAllUsersError, type AdminGetAllUsersResponse, type AdminGetInstancePlansError, type AdminGetInstancePlansResponse, type AdminCreateInstancePlanData, type AdminCreateInstancePlanError, type AdminCreateInstancePlanResponse, type AdminUpdateInstancePlanData, type AdminUpdateInstancePlanError, type AdminUpdateInstancePlanResponse, type AdminDeleteInstancePlanData, type AdminDeleteInstancePlanError, type AdminDeleteInstancePlanResponse, AdminGetAllUsersResponseTransformer, type BillingGetBillingOverviewData, type BillingGetBillingOverviewError, type BillingGetBillingOverviewResponse, type BillingGetAllUserTransactionsData, type BillingGetAllUserTransactionsError, type BillingGetAllUserTransactionsResponse, type BillingTopUpData, type BillingTopUpError, type BillingTopUpResponse, type BillingGetUserWalletData, type BillingGetUserWalletError, type BillingGetUserWalletResponse, type ClusterCreateJoinTokenData, type ClusterCreateJoinTokenError, type ClusterCreateJoinTokenResponse, type ClusterAddMemberData, type ClusterAddMemberError, type ClusterAddMemberResponse, type InstanceInstanceDetailsError, type InstanceInstanceDetailsResponse, type InstanceListInstancesData, type InstanceListInstancesError, type InstanceListInstancesResponse, type InstanceGetInstanceData, type InstanceGetInstanceError, type InstanceGetInstanceResponse, type InstanceCreateInstanceData, type InstanceCreateInstanceError, type InstanceCreateInstanceResponse, type InstanceStartInstanceData, type InstanceStartInstanceError, type InstanceStartInstanceResponse, type InstanceStopInstanceData, type InstanceStopInstanceError, type InstanceStopInstanceResponse, type InstanceDeleteInstanceData, type InstanceDeleteInstanceError, type InstanceDeleteInstanceResponse, type InstanceRestartInstanceData, type InstanceRestartInstanceError, type InstanceRestartInstanceResponse, type InstanceGetInstanceStateData, type InstanceGetInstanceStateError, type InstanceGetInstanceStateResponse, InstanceListInstancesResponseTransformer, InstanceGetInstanceResponseTransformer, InstanceCreateInstanceResponseTransformer, type RootRootError, type RootRootResponse, type UserCreateUserData, type UserCreateUserError, type UserCreateUserResponse, type UserLoginUserData, type UserLoginUserError, type UserLoginUserResponse, type UserGetUserSessionError, type UserGetUserSessionResponse, type UserLogoutUserError, type UserLogoutUserResponse, UserCreateUserResponseTransformer } from './types.gen';
=======
import { type AdminGetAllUsersError, type AdminGetAllUsersResponse, AdminGetAllUsersResponseTransformer, type BillingGetBillingOverviewData, type BillingGetBillingOverviewError, type BillingGetBillingOverviewResponse, type BillingGetAllUserTransactionsData, type BillingGetAllUserTransactionsError, type BillingGetAllUserTransactionsResponse, type BillingTopUpData, type BillingTopUpError, type BillingTopUpResponse, type BillingGetUserWalletData, type BillingGetUserWalletError, type BillingGetUserWalletResponse, type ClusterCreateJoinTokenData, type ClusterCreateJoinTokenError, type ClusterCreateJoinTokenResponse, type ClusterAddMemberData, type ClusterAddMemberError, type ClusterAddMemberResponse, type ClusterGetMembersStateError, type ClusterGetMembersStateResponse, type InstanceInstanceDetailsError, type InstanceInstanceDetailsResponse, type InstanceListInstancesData, type InstanceListInstancesError, type InstanceListInstancesResponse, type InstanceGetInstanceData, type InstanceGetInstanceError, type InstanceGetInstanceResponse, type InstanceCreateInstanceData, type InstanceCreateInstanceError, type InstanceCreateInstanceResponse, type InstanceStartInstanceData, type InstanceStartInstanceError, type InstanceStartInstanceResponse, type InstanceStopInstanceData, type InstanceStopInstanceError, type InstanceStopInstanceResponse, type InstanceDeleteInstanceData, type InstanceDeleteInstanceError, type InstanceDeleteInstanceResponse, type InstanceRestartInstanceData, type InstanceRestartInstanceError, type InstanceRestartInstanceResponse, type InstanceGetInstanceStateData, type InstanceGetInstanceStateError, type InstanceGetInstanceStateResponse, InstanceListInstancesResponseTransformer, InstanceGetInstanceResponseTransformer, InstanceCreateInstanceResponseTransformer, type RootRootError, type RootRootResponse, type UserCreateUserData, type UserCreateUserError, type UserCreateUserResponse, type UserLoginUserData, type UserLoginUserError, type UserLoginUserResponse, type UserGetUserSessionError, type UserGetUserSessionResponse, type UserLogoutUserError, type UserLogoutUserResponse, UserCreateUserResponseTransformer } from './types.gen';
>>>>>>> 41f5983 (regenerate client)

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
    
    /**
     * Get Instance Plans
     */
    public static adminGetInstancePlans<ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) {
        return (options?.client ?? client).get<AdminGetInstancePlansResponse, AdminGetInstancePlansError, ThrowOnError>({
            ...options,
            url: '/admin/instance-plans'
        });
    }
    
    /**
     * Create Instance Plan
     */
    public static adminCreateInstancePlan<ThrowOnError extends boolean = false>(options: Options<AdminCreateInstancePlanData, ThrowOnError>) {
        return (options?.client ?? client).post<AdminCreateInstancePlanResponse, AdminCreateInstancePlanError, ThrowOnError>({
            ...options,
            url: '/admin/instance-plan/create'
        });
    }
    
    /**
     * Update Instance Plan
     */
    public static adminUpdateInstancePlan<ThrowOnError extends boolean = false>(options: Options<AdminUpdateInstancePlanData, ThrowOnError>) {
        return (options?.client ?? client).put<AdminUpdateInstancePlanResponse, AdminUpdateInstancePlanError, ThrowOnError>({
            ...options,
            url: '/admin/instance-plan/update'
        });
    }
    
    /**
     * Delete Instance Plan
     */
    public static adminDeleteInstancePlan<ThrowOnError extends boolean = false>(options: Options<AdminDeleteInstancePlanData, ThrowOnError>) {
        return (options?.client ?? client).delete<AdminDeleteInstancePlanResponse, AdminDeleteInstancePlanError, ThrowOnError>({
            ...options,
            url: '/admin/instance-plan/delete'
        });
    }
    
}

export class BillingService {
    /**
     * Get Billing Overview
     */
    public static billingGetBillingOverview<ThrowOnError extends boolean = false>(options: Options<BillingGetBillingOverviewData, ThrowOnError>) {
        return (options?.client ?? client).get<BillingGetBillingOverviewResponse, BillingGetBillingOverviewError, ThrowOnError>({
            ...options,
            url: '/billing/overview/{username}'
        });
    }
    
    /**
     * Get All User Transactions
     */
    public static billingGetAllUserTransactions<ThrowOnError extends boolean = false>(options: Options<BillingGetAllUserTransactionsData, ThrowOnError>) {
        return (options?.client ?? client).get<BillingGetAllUserTransactionsResponse, BillingGetAllUserTransactionsError, ThrowOnError>({
            ...options,
            url: '/billing/transactions/{username}'
        });
    }
    
    /**
     * Top Up
     */
    public static billingTopUp<ThrowOnError extends boolean = false>(options: Options<BillingTopUpData, ThrowOnError>) {
        return (options?.client ?? client).post<BillingTopUpResponse, BillingTopUpError, ThrowOnError>({
            ...options,
            url: '/billing/topup/{username}'
        });
    }
    
    /**
     * Get User Wallet
     */
    public static billingGetUserWallet<ThrowOnError extends boolean = false>(options: Options<BillingGetUserWalletData, ThrowOnError>) {
        return (options?.client ?? client).get<BillingGetUserWalletResponse, BillingGetUserWalletError, ThrowOnError>({
            ...options,
            url: '/billing/wallet/{username}'
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
    
    /**
     * Get Members State
     */
    public static clusterGetMembersState<ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) {
        return (options?.client ?? client).get<ClusterGetMembersStateResponse, ClusterGetMembersStateError, ThrowOnError>({
            ...options,
            url: '/internal/cluster/members/state_info'
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
    public static instanceListInstances<ThrowOnError extends boolean = false>(options: Options<InstanceListInstancesData, ThrowOnError>) {
        return (options?.client ?? client).get<InstanceListInstancesResponse, InstanceListInstancesError, ThrowOnError>({
            ...options,
            url: '/instance/list/{username}',
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
    
    /**
     * Get Instance State
     */
    public static instanceGetInstanceState<ThrowOnError extends boolean = false>(options: Options<InstanceGetInstanceStateData, ThrowOnError>) {
        return (options?.client ?? client).get<InstanceGetInstanceStateResponse, InstanceGetInstanceStateError, ThrowOnError>({
            ...options,
            url: '/instance/{instance_name}/state'
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