// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  userToken: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const resp = await fetch("https://paper.xyz/api/v1/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PAPER_SECRET_KEY}`,
    },
    body: JSON.stringify({
      code: req.body.code,
      clientId: process.env.PAPER_CLIENT_ID,
    }),
  });
  if (resp.status === 200) {
    const { userToken } = await resp.json();
    res.status(200).json({ userToken });
    // ...`userToken` is a permanent token used to retrieve user/wallet details.
  } else {
    res.status(500);
  }
}
