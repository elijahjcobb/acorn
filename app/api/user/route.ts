import { createEndpointPages } from "../../../lib/api/create-endpoint";
import { verifyUser } from "../../../lib/api/token";

export interface ResponseUser {
  id: string;
  username: string;
  name: string;
}

export default createEndpointPages<ResponseUser>({
  GET: async ({ req, res }) => {
    const user = await verifyUser(req);
    res.json({
      username: user.username,
      id: user.id,
      name: user.name,
    });
  },
});
