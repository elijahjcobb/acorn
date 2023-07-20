import { KrBcrypt } from "@element-ts/krypton";

const CODING = "base64";
const SEP = "&";

export async function createPassword(rawPassword: string): Promise<string> {
  const ret = await KrBcrypt.createPassword(rawPassword);
  const pepper = ret.password.toString(CODING);
  const salt = ret.salt.toString(CODING);
  return `${salt}${SEP}${pepper}`;
}

export async function verifyPassword(
  rawPassword: string,
  password: string
): Promise<boolean> {
  const [saltString, pepperString] = password.split(SEP);
  const pepper = Buffer.from(pepperString, CODING);
  const salt = Buffer.from(saltString, CODING);
  try {
    return await KrBcrypt.verifyPassword(rawPassword, pepper, salt);
  } catch {
    return false;
  }
}
