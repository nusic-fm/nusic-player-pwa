// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { paths } from "@reservoir0x/reservoir-sdk";
import { PricesObj } from "../../src/models/Price";
import { ethers } from "ethers";

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // if (req.method !== "POST") {
  //   res.status(405).send("Only POST requests allowed");
  //   return;
  // }
  //   const tokens = req.body.tokens;
  const baseUrl = req.body.baseUrl;
  const tokens = req.body.tokens;
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
        pricesObj[`${t.token.contract}-${t.token.tokenId}`] = {
          lastBuy: t.token.lastBuy.value,
          lastSell: t.token.lastSell.value,
          price: t.market.floorAsk.price?.amount?.raw
            ? ethers.utils.formatEther(t.market.floorAsk.price?.amount.raw)
            : 0,
        };
      });
    }
    res.json({ pricesObj, tokens: [] });
  } catch (e: any) {
    // res.status(500).send(e.message);
    console.log(e.message);
  }
}
