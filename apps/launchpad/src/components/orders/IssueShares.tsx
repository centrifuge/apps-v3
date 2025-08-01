import { ProcessShares } from './ProcessShares'

export const IssueShares = ({ onClose }: { onClose: () => void }) => {
  return <ProcessShares mode="issue" onClose={onClose} />
}
