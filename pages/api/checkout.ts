// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const tokenAddress = req.body.tokenAddress;
  const tokenId = req.body.tokenId;
  const body = {
    contractId: "58cfab4e-c4d5-474c-a689-c90f77bd9b00",
    title: "NUSIC Paper Checkout",
    contractArgs: {
      collectionContractAddress: tokenAddress,
      tokenId: tokenId,
      // (Optional)
      // marketplaceSource: "MARKETPLACE_SOURCE",
    },
  };

  try {
    console.log(process.env.PAPER_SECRET_KEY);
    const resp = await axios.post(
      "https://withpaper.com/api/2022-08-12/checkout-link-intent",
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAPER_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const { checkoutLinkIntentUrl } = resp.data;
    res.json({ checkoutLinkIntentUrl });
  } catch (e: any) {
    res.status(500).send(e.message);
  }
}
