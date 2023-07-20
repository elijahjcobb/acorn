import { TObject, TStandard } from "@elijahjcobb/typr";
import { createEndpointPages } from "../../../lib/api/create-endpoint";
import { generateKey } from "../../../lib/api/generate-key";
import { verifyUser } from "../../../lib/api/token";
import { verifyBody } from "../../../lib/api/type-check";
import type { ResponseFeedItem } from "../user/feed/route";

export default createEndpointPages<ResponseFeedItem>({
  POST: async ({ req, db, res }) => {
    const user = await verifyUser(req);
    const { content } = verifyBody(
      req,
      TObject.follow({
        content: TStandard.string,
      })
    );

    const nut = await db.nut.create({
      data: {
        user_id: user.id,
        content,
      },
    });

    res.status(200).json({
      key: generateKey({
        userId: user.id,
        nutId: nut.id,
        nutUserId: user.id,
        type: "tick",
      }),
      event: {
        type: "nut",
        id: nut.id,
        content: null,
        createdAt: nut.created_at.toUTCString(),
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          followCount: user.follow_count,
          followerCount: user.follower_count,
        },
      },
      nut: {
        id: nut.id,
        content: nut.content,
        likeCount: nut.like_count,
        shareCount: nut.share_count,
        commentCount: nut.comment_count,
        liked: false,
        shared: false,
        createdAt: nut.created_at.toUTCString(),
        updatedAt: nut.updated_at.toUTCString(),
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          followCount: user.follow_count,
          followerCount: user.follower_count,
        },
      },
    });
  },
});
