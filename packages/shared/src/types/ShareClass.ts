import { ShareClass } from '@centrifuge/sdk'

export type ShareClassWithDetails = {
  shareClass: ShareClass
  details: Awaited<ReturnType<typeof ShareClass.prototype.details>>
}
