export interface LoginModel{
    username:string;
    password:string;
}

export interface LoginResult
{
    userName: string;
    email: string;
    token: string;
    isSuccess:boolean;
}