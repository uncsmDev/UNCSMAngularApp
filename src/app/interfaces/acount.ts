export interface Login{
    username:string;
    password:string;
}

export interface LoginResult
{
    token: string;
    isSuccess:boolean;
}

export interface TokenData {
    name: string;
    personaId: number;
    urlImage: string;
    email: string;
    nameid: string;
}