import { TObject, TStandard } from "@elijahjcobb/typr";
import { createEndpointPages } from "../../../../lib/api/create-endpoint";
import { verifyUser } from "../../../../lib/api/token";
import { verifyBody } from "../../../../lib/api/type-check";

export interface ResponseLike {
  count: number;
  status: boolean;
}

export default createEndpointPages<ResponseLike>({
  POST: async ({ req, res, db }) => {
    const { id } = verifyBody(
      req,
      TObject.follow({
        id: TStandard.string,
      })
    );
    const user = await verifyUser(req);

    const { nut, hasLikedNut } = await db.$transaction(async (tx) => {
      const likeCount = await tx.like.count({
        where: {
          nut_id: id,
          user_id: user.id,
        },
      });

      console.log({ id, userId: user.id });

      const hasLikedNut = likeCount > 0;
      const delta = hasLikedNut ? -1 : 1;

      let nut = await tx.nut.update({
        where: { id },
        data: { like_count: { increment: delta } },
      });

      if (nut.like_count < 0) {
        nut = await tx.nut.update({
          where: { id },
          data: { like_count: 0 },
        });
      }

      if (hasLikedNut) {
        await tx.like.deleteMany({
          where: {
            nut_id: id,
            user_id: user.id,
          },
        });
      } else {
        await tx.like.create({
          data: {
            nut_id: id,
            user_id: user.id,
          },
        });
      }
      return { nut, hasLikedNut };
    });

    res.status(200).json({ count: nut.like_count, status: !hasLikedNut });
  },
});
