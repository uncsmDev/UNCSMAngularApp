export enum ResultEnum
{
		Success,
		Error,
		NotFound,
		Unauthorized,
		Created,
		Updated,
		Deleted
}

// Generated by https://quicktype.io

export interface Result<T> {
	data?:           T;
	status:         ResultEnum;
	message:        string;
}
