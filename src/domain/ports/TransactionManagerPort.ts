export default interface TransactionManagerPort {
    run<T>(work: (tx: unknown) => Promise<T>): Promise<T>;
}
