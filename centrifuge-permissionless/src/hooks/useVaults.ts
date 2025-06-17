import { useEffect, useMemo, useState } from "react";
import { useChainId } from "wagmi";
import { combineLatest, of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { centrifuge } from "../centrifuge";
import type { PoolId, ShareClassId, Vault } from "@centrifuge/sdk";
import { useObservable } from "./useObservable";

interface VaultWithMeta extends Vault {
  shareClassId: ShareClassId;
  asset: string;
}

export function useVaults(poolId: PoolId) {
  const pool$ = useMemo(() => useObservable(centrifuge.pool(poolId)), [poolId]);
  

  return {}
}