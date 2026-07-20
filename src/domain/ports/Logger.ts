export default interface Logger {
    info: (message: string, obj?: Object) => void;
    error: (message: string, obj?: Object) => void;
}