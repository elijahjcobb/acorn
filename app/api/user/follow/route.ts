import { TObject, TStandard } from "@elijahjcobb/typr";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { APIError } from "../../../../lib/api/api-error";
import { createEndpointPages } from "../../../../lib/api/create-endpoint";
import { verifyUser } from "../../../../lib/api/token";
import { verifyBody } from "../../../../lib/api/type-check";

export default createEndpointPages({
  POST: async ({ req, res, db }) => {
    const { id: followedUserId } = verifyBody(
      req,
      TObject.follow({
        id: TStandard.string,
      })
    );
    const user = await verifyUser(req);

    await db.follow.create({
      data: {
        followed_user_id: followedUserId,
        user_id: user.id,
      },
    });

    await db.user.update({
      where: { id: user.id },
      data: { follow_count: { increment: 1 } },
    });

    await db.user.update({
      where: { id: followedUserId },
      data: { follower_count: { increment: 1 } },
    });

    res.status(200).json({});
  },
});
