import { z } from 'zod'
import { AssetId } from '@centrifuge/sdk'

export const SelectAssetsSchema = z.object({
  selectedAssets: z.array(z.instanceof(AssetId)).min(1, 'At least one asset is required'),
})
