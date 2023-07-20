import { createEndpointPages } from "../../../../lib/api/create-endpoint";
import { verifyUser } from "../../../../lib/api/token";
import type { ResponseTick } from "../[id]/route";

export default createEndpointPages<ResponseTick[]>({
  GET: async ({ req, res, db }) => {
    await verifyUser(req);
    const ticks = await db.nut.findMany({
      take: 100,
      orderBy: [
        {
          updated_at: "desc",
        },
      ],
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });
    res.json(ticks);
  },
});
