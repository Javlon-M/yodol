export interface BaseInterfaceForUseCases<Arguments, ReturnType> {
    execute(params: Arguments): Promise<ReturnType | ResultOfUseCaseOnError>;
}
  
export interface ResultOfUseCaseOnError {
    error: boolean;
    message: string;
}
