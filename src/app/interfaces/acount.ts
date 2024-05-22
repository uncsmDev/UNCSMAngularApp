export interface Login{
    username:string;
    password:string;
}

export interface LoginResult
{
    IdUser: string;
    userName: string;
    email: string;
    token: string;
    isSuccess:boolean;
}