import { vi } from "vitest";
import Logger from "../../../../../domain/ports/LoggerPort";


export function createFakeLogger():Logger {
    return {
        info:vi.fn(),
        error:vi.fn(),
    }
}