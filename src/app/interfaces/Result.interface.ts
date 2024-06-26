export interface Result<T> {
    data:T;
    Status:ResultEnum;
    Message:string;
}

enum ResultEnum
{
		Success,
		Error,
		NotFound,
		Unauthorized,
		Created,
		Updated,
		Deleted
}