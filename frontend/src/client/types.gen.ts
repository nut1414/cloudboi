// This file is auto-generated by @hey-api/openapi-ts

export type HTTPValidationError = {
    detail?: Array<ValidationError>;
};

export type Item = {
    name: string;
    price: number;
};

export type ResponseMessage = {
    message: string;
};

export type TestModel = {
    test_response: number;
    test_response2: number;
};

export type User = {
    username: string;
};

export type ValidationError = {
    loc: Array<(string | number)>;
    msg: string;
    type: string;
};

export type AdminAdminUpdateAdminData = {
    headers: {
        'x-token': string;
    };
};

export type AdminAdminUpdateAdminResponse = (ResponseMessage);

export type AdminAdminUpdateAdminError = (HTTPValidationError);

export type GetResponse = (unknown);

export type GetError = unknown;

export type ItemsItemsReadItemsData = {
    headers: {
        'x-token': string;
    };
};

export type ItemsItemsReadItemsResponse = (Array<Item>);

export type ItemsItemsReadItemsError = (unknown | HTTPValidationError);

export type ItemsItemsReadItemData = {
    headers: {
        'x-token': string;
    };
    path: {
        item_id: string;
    };
};

export type ItemsItemsReadItemResponse = (Item);

export type ItemsItemsReadItemError = (unknown | HTTPValidationError);

export type ItemsItemsUpdateItemData = {
    headers: {
        'x-token': string;
    };
    path: {
        item_id: string;
    };
};

export type ItemsItemsUpdateItemResponse = (ResponseMessage);

export type ItemsItemsUpdateItemError = (unknown | HTTPValidationError);

export type RootRootResponse = (unknown);

export type RootRootError = unknown;

export type TestapiReadTestapiData = {
    path: {
        item: number;
    };
};

export type TestapiReadTestapiResponse = (TestModel);

export type TestapiReadTestapiError = (HTTPValidationError);

export type UsersReadUsersResponse = (Array<User>);

export type UsersReadUsersError = unknown;

export type UsersReadUserMeResponse = (User);

export type UsersReadUserMeError = unknown;

export type UsersReadUserData = {
    path: {
        username: string;
    };
};

export type UsersReadUserResponse = (User);

export type UsersReadUserError = (HTTPValidationError);