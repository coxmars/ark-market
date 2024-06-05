import { useMemo } from "react";
import * as blockies from "blockies-ts";

interface UseBlockiesParams {
  address: string | undefined;
}

export default function useBlockies({ address }: UseBlockiesParams) {
  const blockiesImageSrc = useMemo(() => {
    if (!address) return "";
    return blockies.create({ seed: address }).toDataURL();
  }, [address]);

  return { blockiesImageSrc };
}
