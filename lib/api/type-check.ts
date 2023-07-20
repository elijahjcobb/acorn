import { T as Typr } from "@elijahjcobb/typr";
import { APIError } from "./api-error";
import { NextRequest } from "next/server";
import { TObjectTypeDefinition } from "@elijahjcobb/typr/dts/TObject";

export async function verifyBody<T>(
  req: NextRequest,
  type: TObjectTypeDefinition<T>
): Promise<T> {
  let b = await req.json();
  const body = Typr.object(type).verify(b);
  if (!body) throw new APIError(400, "Invalid request body.");
  return body as T;
}
