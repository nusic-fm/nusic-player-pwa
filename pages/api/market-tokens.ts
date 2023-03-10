// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { getNftRecommendedTokens } from "../../src/services/db/tokens.service";
import { paths } from "@reservoir0x/reservoir-sdk";
import { PricesObj } from "../../src/models/Price";
import { ethers } from "ethers";

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).send("Only POST requests allowed");
    return;
  }
  //   const tokens = req.body.tokens;
  const baseUrl = req.body.baseUrl;

  const tokensDoc = await getNftRecommendedTokens();
  const tokens = tokensDoc.map((t) => `${t.tokenAddress}:${t.tokenId}`);

  let tokensParam = "";
  tokens.map((t: string, i: number) => {
    if (i === 0) {
      tokensParam += `tokens=${encodeURIComponent(t)}`;
    } else {
      tokensParam += `&tokens=${encodeURIComponent(t)}`;
    }
  });
  try {
    const response = await axios.get(`${baseUrl}?${tokensParam}`, {
      headers: {
        accept: "*/*",
        // 'x-api-key': '',
      },
    });

    const data =
      response.data as paths["/tokens/v5"]["get"]["responses"]["200"]["schema"];
    const pricesObj: PricesObj = {};
    if (data.tokens) {
      data.tokens.map((t: any) => {
        console.log(t.market.floorAsk);
        pricesObj[`${t.token.contract}-${t.token.tokenId}`] = {
          lastBuy: t.token.lastBuy.value,
          lastSell: t.token.lastSell.value,
          price: ethers.utils.formatEther(t.market.floorAsk.price?.amount.raw),
        };
      });
    }
    res.json({ pricesObj, tokens: tokensDoc });
  } catch (e: any) {
    // res.status(500).send(e.message);
    console.log(e.message);
  }
}
