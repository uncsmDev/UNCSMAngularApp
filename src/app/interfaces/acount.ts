export interface Login{
    username:string;
    password:string;
}

export interface LoginResult
{
    token: string;
    isSuccess:boolean;
}