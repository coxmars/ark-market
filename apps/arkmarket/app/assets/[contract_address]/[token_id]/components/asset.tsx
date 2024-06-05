"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RiTwitterXLine } from "react-icons/ri";
import { useQuery } from "react-query";

import { Button } from "@ark-market/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ark-market/ui/components/tooltip";

import Media from "~/components/media";
import { getTokenData, getTokenMarketData } from "../data";
import AssetsInfos from "./asset-infos";
import CancelListing from "./cancel-listing";
import CreateListing from "./create-listing";
import CreateOffer from "./create-offer";
import FulfillListing from "./fulfill-listing";
import FulFillOffer from "./fulfill-offer";
import Activity from "./token-activity";
import TokenOffers from "./token-offers";

interface AssetProps {
  collection: any;
  params: any;
}

const Asset: React.FC<AssetProps> = ({ params, collection }) => {
  const { data: tokenMarketData }: any = useQuery(
    "tokenMarketData",
    () =>
      getTokenMarketData({
        contract_address: params.contract_address,
        token_id: params.token_id,
      }),
    {
      refetchInterval: 10000,
    },
  );

  const {
    data: tokenData,
    isLoading,
    error,
  }: any = useQuery(
    "tokenMetadata",
    () => getTokenData(params.contract_address, params.token_id),
    {
      refetchInterval: 10000,
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  const token = tokenData.result;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="grid grid-cols-3 grid-rows-3 gap-6">
        <div className="col-span-1 row-span-3 flex flex-col space-y-5">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold uppercase">
              {collection.name} #{token.token_id}
            </h1>
            <div className="flex justify-between">
              <Link href="/collection" target="_blank">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/everai.jpg"
                    width="30"
                    height="30"
                    alt="everai"
                    className="rounded-full"
                  />
                  <h1 className="text-sm text-slate-300">{collection.name}</h1>
                </div>
              </Link>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="https://twitter.com/Everai" target="_blank">
                      <Button variant="ghost" size="icon">
                        <RiTwitterXLine />
                        <span className="sr-only">Archive</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Twitter</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-md">
            {token.metadata?.normalized?.image ? (
              <Media
                src={token.metadata.normalized.image}
                alt={token.token_id || "Token Image"}
              />
            ) : (
              <Media src="/missing.jpg" alt={token.token_id || "Token Image"} />
            )}
          </div>
          <FulfillListing token={token} tokenMarketData={tokenMarketData} />
          <FulFillOffer tokenMarketData={tokenMarketData} token={token} />
          <CancelListing
            token={token}
            tokenMarketData={tokenMarketData || undefined}
          />
        </div>
        <div className="col-span-2 row-span-3 space-y-4">
          <AssetsInfos
            token={token}
            tokenMarketData={tokenMarketData || undefined}
          />
          <CreateListing
            token={token}
            tokenMarketData={tokenMarketData || undefined}
          />
          <CreateOffer
            token={token}
            tokenMarketData={tokenMarketData || undefined}
          />
          <TokenOffers token={token} />
          <Activity params={params} />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Asset;
