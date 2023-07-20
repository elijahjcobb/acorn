import { TObject, TStandard } from "@elijahjcobb/typr";
import { setCookie } from "cookies-next";
import { APIError } from "../../../../lib/api/api-error";
import { createEndpointPages } from "../../../../lib/api/create-endpoint";
import { verifyPassword } from "../../../../lib/api/password";
import { tokenSign, TOKEN_AGE_SEC } from "../../../../lib/api/token";
import { verifyBody } from "../../../../lib/api/type-check";

const INCORRECT_AUTH = new APIError(401, "Invalid username or password.");

export default createEndpointPages<{
  token: string;
}>({
  POST: async ({ res, req, db }) => {
    const { username, password: rawPassword } = verifyBody(
      req,
      TObject.follow({
        username: TStandard.string,
        password: TStandard.string,
      })
    );

    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) throw INCORRECT_AUTH;
    const isCorrect = await verifyPassword(rawPassword, user.password);
    if (!isCorrect) throw INCORRECT_AUTH;

    const token = await tokenSign(user.id);

    setCookie("token", token, { req, res, maxAge: TOKEN_AGE_SEC });
    res.json({ token });
  },
});
