import { PasswordHasherPort } from "../../../domain/ports/PasswordHasherPort";
import { hash, verify } from "argon2";

export default class Argon2PasswordHasher implements PasswordHasherPort {

  public async hash(plainText: string): Promise<string> {
    return await hash(plainText);
  }

  public async compare (plainText: string, hash: string): Promise<boolean> {
    return (await verify(hash, plainText)).valueOf()
  }
}
