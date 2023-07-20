import { nut } from "@prisma/client";
import { createEndpointPages } from "../../../../lib/api/create-endpoint";
import { verifyUser } from "../../../../lib/api/token";

export interface ResponseTick extends nut {
  user: {
    username: string;
    id: string;
    name: string;
  };
}

export default createEndpointPages<ResponseTick>({
  GET: async ({ req, res, db }) => {
    const tickId = req.query.id as string;
    await verifyUser(req);
    const tick = await db.nut.findUniqueOrThrow({ where: { id: tickId } });
    const {
      username,
      id: userId,
      name,
    } = await db.user.findUniqueOrThrow({
      where: { id: tick.user_id },
    });
    res.json({
      ...tick,
      user: {
        username,
        id: userId,
        name,
      },
    });
  },
});
