export type OperationResult<T> = {
    success: boolean;
    data?: T;
    error?: string;
}
