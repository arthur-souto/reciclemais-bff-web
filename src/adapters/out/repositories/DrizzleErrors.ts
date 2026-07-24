const FOREIGN_KEY_VIOLATION = "23503";

export function isForeignKeyViolation(err: unknown): boolean {
    return typeof err === "object" && err !== null
        && "cause" in err
        && typeof err.cause === "object" && err.cause !== null
        && "code" in err.cause
        && err.cause.code === FOREIGN_KEY_VIOLATION;
}
