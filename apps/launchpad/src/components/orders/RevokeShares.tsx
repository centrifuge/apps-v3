import { ProcessShares } from './ProcessShares'

export const RevokeShares = ({ onClose }: { onClose: () => void }) => {
  return <ProcessShares mode="revoke" onClose={onClose} />
}
