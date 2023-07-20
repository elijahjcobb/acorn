import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { setCookie } from "cookies-next";
import { APIError } from "../../../../lib/api/api-error";
import { createEndpoint, createEndpointPages } from "@/lib/api/create-endpoint";
import { createPassword } from "../../../../lib/api/password";
import { tokenSign, TOKEN_AGE_SEC } from "../../../../lib/api/token";
import { verifyBody } from "../../../../lib/api/type-check";

export const POST = createEndpoint(async (req) => {});

export default createEndpointPages<{
  token: string;
}>({
  POST: async ({ req, res, db }) => {
    const {
      username,
      password: rawPassword,
      name,
    } = verifyBody(
      req,
      TObject.follow({
        username: TStandard.string,
        password: TStandard.string,
        name: TStandard.string,
      })
    );

    if (rawPassword.length < 8)
      throw new APIError(
        406,
        "C'mon, at least make your password 8 characters long..."
      );

    const password = await createPassword(rawPassword);

    try {
      const user = await db.user.create({
        data: {
          username,
          password,
          name,
        },
      });

      const token = await tokenSign(user.id);
      setCookie("token", token, { req, res, maxAge: TOKEN_AGE_SEC });
      res.json({ token });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new APIError(406, "Someone already took that username.");
        }
      }
      throw e;
    }
  },
});
