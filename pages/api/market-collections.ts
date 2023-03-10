// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { getNftCollectionsToken } from "../../src/services/db/tokens.service";
import { paths } from "@reservoir0x/reservoir-sdk";
import { PricesObj } from "../../src/models/Price";
import { getNftCollections } from "../../src/services/db/collections.service";

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
  const baseUrl = "https://api.reservoir.tools/collections/v5";

  const collectionsDoc = await getNftCollections();
  const collectionAddresses = collectionsDoc.map((c) => c.id);

  let params = "";
  collectionAddresses.map((t: string, i: number) => {
    if (i === 0) {
      params += `contract=${encodeURIComponent(t)}`;
    } else {
      params += `&contract=${encodeURIComponent(t)}`;
    }
  });
  try {
    const response = await axios.get(`${baseUrl}?${params}`, {
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
        pricesObj[`${t.token.contract}:${t.token.collection.id}`] = {
          lastBuy: t.token.lastBuy.value,
          lastSell: t.token.lastSell.value,
          price: t.market.floorAsk.price,
        };
      });
    }

    res.json({ pricesObj, collections: collectionsDoc });
  } catch (e) {
    res.status(500).send("Error in Reservoir");
  }
}
