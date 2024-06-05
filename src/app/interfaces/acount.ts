export interface Login{
    username:string;
    password:string;
}

export interface LoginResult
{
    idUser: string;
    userName: string;
    email: string;
    token: string;
    isSuccess:boolean;
}