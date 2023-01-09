// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  email: string;
  walletAddress: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const resp = await fetch("https://paper.xyz/api/v1/oauth/user-details", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PAPER_SECRET_KEY}`,
    },
    body: JSON.stringify({
      userToken: req.body.userToken,
      clientId: process.env.PAPER_CLIENT_ID,
    }),
  });
  if (resp.status === 200) {
    const resJson = (await resp.json()) as Data;
    res.status(200).json(resJson);
    // ...`userToken` is a permanent token used to retrieve user/wallet details.
  } else {
    res.status(500);
  }
}
