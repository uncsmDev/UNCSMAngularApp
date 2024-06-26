
export enum Repuesta {
    Success,
    Error,
    NotFound,
    Unauthorized,
    Created,
    Updated,
    Deleted 
}
export class Result<T> {
    public data?: T;
    public status!: Repuesta;
    public message!: string;
}
