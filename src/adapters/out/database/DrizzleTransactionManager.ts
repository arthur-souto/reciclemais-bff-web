import TransactionManagerPort from "../../../domain/ports/TransactionManagerPort";
import { db } from "../../../infrastructure/database/client";

// port para transactional
// use para operações que alterem 2 ou mais entidades
// recebe uma funcao e retorna uma promessa do tipo
export default class DrizzleTransactionManager implements TransactionManagerPort {
    async run<T>(work: (tx: unknown) => Promise<T>): Promise<T> {
        return db.transaction((tx) => work(tx));
    }
}
