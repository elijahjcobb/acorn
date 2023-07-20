import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextApiRequest, NextApiResponse } from "next";
import { APIError } from "./api-error";
import { client } from "./prisma";
import { NextRequest, NextResponse } from "next/server";

export type MethodType = "GET" | "PUT" | "POST" | "DELETE";

type Handler<T> = (refs: {
  req: NextApiRequest;
  res: NextApiResponse<T>;
  db: PrismaClient;
}) => Promise<void>;

export function createEndpointPages<T extends object>(
  handlers: Partial<Record<MethodType, Handler<T>>>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      let handler: Handler<T> | undefined = handlers[req.method as MethodType];
      if (!handler) throw new APIError(404, "Endpoint not found.");
      await handler({ req, res, db: client });
    } catch (e) {
      console.error(e);
      if (e instanceof APIError) {
        return res.status(e.code).json({ error: e.message });
      } else if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2025" || e.code === "P2023") {
          return res.status(404).json({ error: "Item not found." });
        }
      }
      res.status(500).json({ error: "Internal server error." });
    }
  };
}

export function createEndpoint(
  handler: (req: NextRequest) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (e) {
      console.error(e);
      if (e instanceof APIError) {
        return NextResponse.json({ error: e.message }, { status: e.code });
      } else if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2025" || e.code === "P2023") {
          return NextResponse.json(
            { error: "Item not found." },
            { status: 404 }
          );
        }
      }
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  };
}
