import { createEndpointPages } from "../../../../lib/api/create-endpoint";
import { generateKey } from "../../../../lib/api/generate-key";
import { verifyUser } from "../../../../lib/api/token";

type Type = "nut" | "comment" | "share" | "like";
export interface RawRow {
  type: Type;
  comment_content: null | string;
  comment_id: null | string;
  nut_id: string;
  created_at: Date;
  id: string;
  user_id: string;
  user_name: string;
  user_username: string;
  user_follow_count: number;
  user_follower_count: number;
  nut_content: string;
  nut_like_count: number;
  nut_comment_count: number;
  nut_share_count: number;
  nut_updated_at: Date;
  nut_user_id: string;
  nut_created_at: Date;
  nut_user_follow_count: number;
  nut_user_follower_count: number;
  nut_user_username: string;
  nut_user_name: string;
  has_liked: null | number;
  has_shared: null | number;
}

export interface ResponseFeedItem {
  key: string;
  event: {
    type: Type;
    id: string;
    content: string | null;
    createdAt: string;
    user: {
      id: string;
      name: string;
      username: string;
      followCount: number;
      followerCount: number;
    };
  };
  nut: {
    id: string;
    content: string;
    likeCount: number;
    shareCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
    liked: boolean;
    shared: boolean;
    user: {
      id: string;
      name: string;
      username: string;
      followCount: number;
      followerCount: number;
    };
  };
}

export default createEndpointPages<ResponseFeedItem[]>({
  GET: async ({ req, res, db }) => {
    const user = await verifyUser(req);
    const feed = (await db.$queryRawUnsafe(`SELECT *
FROM   (SELECT 'share'       AS type,
               NULL           AS comment_content,
               NULL           AS comment_id,
               share.nut_id AS nut_id,
               share.created_at,
               share.user_id
        FROM   public.share share
        UNION ALL
        SELECT 'nut'  AS type,
               NULL    AS comment_content,
               NULL    AS comment_id,
               nut.id AS nut_id,
               nut.created_at,
               nut.user_id
        FROM   public.nut nut) raw_data
       JOIN (SELECT id             AS user_id,
                    name           AS user_name,
                    username       AS user_username,
                    follow_count   AS user_follow_count,
                    follower_count AS user_follower_count
             FROM   public.user) u
         ON raw_data.user_id = u.user_id
       JOIN (SELECT id       AS nut_id,
                    content       AS nut_content,
                    like_count   AS nut_like_count,
                    comment_count AS nut_comment_count,
                    share_count  AS nut_share_count,
                    updated_at    AS nut_updated_at,
                    user_id       AS nut_user_id,
                    created_at    AS nut_created_at
             FROM   public.nut) AS nut
         ON nut.nut_id = raw_data.nut_id
       JOIN (SELECT id,
                    follow_count   AS nut_user_follow_count,
                    follower_count AS nut_user_follower_count,
                    username       AS nut_user_username,
                    name           AS nut_user_name
             FROM   public.user) nut_u
         ON nut_u.id = nut.nut_user_id
       left JOIN (select count(*) as has_liked, nut_id as h_id from public.like where public.like.user_id='${user.id}' GROUP BY nut_id) like_status
         ON like_status.h_id=raw_data.nut_id
       left JOIN (select count(*) as has_shared, nut_id as rt_id from public.share where public.share.user_id='${user.id}' GROUP BY nut_id) share_status
         ON share_status.rt_id=raw_data.nut_id
ORDER  BY created_at DESC
LIMIT  300;`)) as RawRow[];

    res.json(
      feed.map((raw) => ({
        key: generateKey({
          userId: raw.user_id,
          nutId: raw.nut_id,
          nutUserId: raw.nut_user_id,
          type: raw.type,
        }),
        event: {
          type: raw.type,
          id:
            raw.comment_id ??
            (raw.type === "nut" ? raw.nut_id : `${raw.nut_id}:${raw.user_id}`),
          content: raw.comment_content,
          createdAt: raw.created_at.toUTCString(),
          user: {
            id: raw.user_id,
            name: raw.user_name,
            username: raw.user_username,
            followCount: raw.user_follow_count,
            followerCount: raw.user_follower_count,
          },
        },
        nut: {
          id: raw.nut_id,
          content: raw.nut_content,
          likeCount: raw.nut_like_count,
          shareCount: raw.nut_share_count,
          commentCount: raw.nut_comment_count,
          liked: (raw.has_liked ?? 0) > 0,
          shared: (raw.has_shared ?? 0) > 0,
          createdAt: raw.nut_created_at.toUTCString(),
          updatedAt: raw.nut_updated_at.toUTCString(),
          user: {
            id: raw.nut_user_id,
            name: raw.nut_user_name,
            username: raw.nut_user_username,
            followCount: raw.nut_user_follow_count,
            followerCount: raw.nut_user_follower_count,
          },
        },
      }))
    );
  },
});
