

export interface IResponseDto {
    isSuccess: Boolean;
    status: string,
    message?: string,
    results?: number,
    data?: any;
    stack?: string,
    error?: any,
}

export interface ITokenResponseDto extends IResponseDto {
    token: string;
    expires: number;
}
