import { TObject, TStandard } from "@elijahjcobb/typr";
import { createEndpointPages } from "../../../../lib/api/create-endpoint";
import { verifyUser } from "../../../../lib/api/token";
import { verifyBody } from "../../../../lib/api/type-check";
import { ResponseLike } from "../like/route";

export default createEndpointPages<ResponseLike>({
  POST: async ({ req, res, db }) => {
    const { id } = verifyBody(
      req,
      TObject.follow({
        id: TStandard.string,
      })
    );
    const user = await verifyUser(req);

    const { nut, hasShared } = await db.$transaction(async (tx) => {
      const shareCount = await tx.share.count({
        where: {
          nut_id: id,
          user_id: user.id,
        },
      });
      const hasShared = shareCount > 0;
      const delta = hasShared ? -1 : 1;

      let nut = await tx.nut.update({
        where: { id },
        data: { share_count: { increment: delta } },
      });

      if (nut.share_count < 0) {
        nut = await tx.nut.update({
          where: { id },
          data: { share_count: 0 },
        });
      }

      if (hasShared) {
        await tx.share.deleteMany({
          where: {
            nut_id: id,
            user_id: user.id,
          },
        });
      } else {
        await tx.share.create({
          data: {
            nut_id: id,
            user_id: user.id,
          },
        });
      }
      return { nut, hasShared };
    });

    res.status(200).json({ count: nut.share_count, status: !hasShared });
  },
});
