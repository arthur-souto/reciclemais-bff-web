// interface que implementa a aplicação
export default interface ApplicationRunnable {
    run: (port: number) => Promise<void>;
    stop: () => Promise<void>;
}