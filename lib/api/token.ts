import { user } from "@prisma/client";
import {
  JsonWebTokenError,
  sign,
  TokenExpiredError,
  verify,
} from "jsonwebtoken";
import { NextApiRequest } from "next";
import { APIError } from "./api-error";
import { client } from "./prisma";
import crypto from "node:crypto";

export interface TokenData {
  userId: string;
}

export interface Token extends TokenData {
  iat: number;
  exp: number;
}

export const TOKEN_AGE_SEC = 60 * 60 * 24 * 30;
const SECRET = process.env.TOKEN_SECRET as string;
if (!SECRET) throw new Error("TOKEN_SECRET is undefined.");

export function tokenSign(userId: string): Promise<string> {
  const token: TokenData = { userId };
  return new Promise((res, rej) => {
    sign(token, SECRET, { expiresIn: TOKEN_AGE_SEC }, (err, token) => {
      if (err || !token) rej(err);
      else res(token);
    });
  });
}

function tokenVerifyInternal(token: string): Promise<Token> {
  return new Promise((res, rej) => {
    verify(token, SECRET, (err, decoded) => {
      if (err || !decoded) rej(err);
      else res(decoded as Token);
    });
  });
}

async function tokenVerifyString(token: string): Promise<Token> {
  try {
    return await tokenVerifyInternal(token);
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      throw new APIError(401, "Authentication expired.");
    } else if (e instanceof JsonWebTokenError) {
      throw new APIError(401, "Authentication invalid.");
    }
    throw e;
  }
}

export async function tokenVerifyRequest(req: NextApiRequest): Promise<Token> {
  let token: string | undefined = req.cookies.token;
  if (!token) {
    const authHeader = req.headers.authorization ?? "";
    const arr = authHeader.split(" ");
    token = arr[1];
  }

  if (!token) {
    throw new APIError(
      401,
      "No token present in cookies as 'token' or bearer token in authorization header."
    );
  }

  return tokenVerifyString(token);
}

export async function verifyUser(req: NextApiRequest): Promise<user> {
  const { userId } = await tokenVerifyRequest(req);
  const user = await client.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new APIError(401, "Authentication user is invalid.");
  if (!user.healthy) throw new APIError(401, "Authentication user is blocked.");
  return user;
}
