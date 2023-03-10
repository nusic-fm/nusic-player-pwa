import { paths } from "@reservoir0x/reservoir-sdk";

export type ReservoirResponseType =
  paths["/tokens/v5"]["get"]["responses"]["200"]["schema"];

export type PricesObj = {
  [key: string]: {
    lastBuy: number | null;
    lastSell: number | null;
    price: number | string | null;
  };
};
