import { TObject, TStandard } from "@elijahjcobb/typr";
import { createEndpointPages } from "../../../../lib/api/create-endpoint";
import { verifyBody } from "../../../../lib/api/type-check";
import { verifyUser } from "../../../../lib/api/token";

export default createEndpointPages({
  POST: async ({ req, res, db }) => {
    const { id, content } = verifyBody(
      req,
      TObject.follow({
        id: TStandard.string,
        content: TStandard.string,
      })
    );
    const user = await verifyUser(req);

    const comment = await db.comment.create({
      data: {
        nut_id: id,
        user_id: user.id,
        content,
      },
    });

    await db.nut.update({
      where: { id },
      data: { comment_count: { increment: 1 } },
    });

    res.status(200).json({ id: comment.id });
  },
});
