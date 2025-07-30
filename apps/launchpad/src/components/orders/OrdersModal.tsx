import { Modal } from '@centrifuge/ui'
import { ApproveDeposits } from './ApproveDeposits'
import { ApproveRedemptions } from './ApproveRedemptions'
import { IssueShares } from './IssueShares'
import { RevokeShares } from './RevokeShares'

const modalConfig = {
  approve: {
    title: 'Approve investments',
  },
  redeem: {
    title: 'Approve redemptions',
  },
  issue: {
    title: 'Issue shares',
  },
  revoke: {
    title: 'Revoke shares',
  },
}

export const OrdersModal = ({
  modal,
  setModal,
}: {
  modal: { approve: boolean; redeem: boolean; issue: boolean; revoke: boolean }
  setModal: (modal: { approve: boolean; redeem: boolean; issue: boolean; revoke: boolean }) => void
}) => {
  const trueKey = Object.keys(modal).find((key) => modal[key as keyof typeof modal] === true)

  const components = {
    approve: (
      <ApproveDeposits onClose={() => setModal({ approve: false, redeem: false, issue: false, revoke: false })} />
    ),
    redeem: (
      <ApproveRedemptions onClose={() => setModal({ approve: false, redeem: false, issue: false, revoke: false })} />
    ),
    issue: <IssueShares onClose={() => setModal({ approve: false, redeem: false, issue: false, revoke: false })} />,
    revoke: <RevokeShares onClose={() => setModal({ approve: false, redeem: false, issue: false, revoke: false })} />,
  }

  if (!trueKey) return null

  return (
    <Modal
      isOpen={modal[trueKey as keyof typeof modal]}
      onClose={() => setModal({ approve: false, redeem: false, issue: false, revoke: false })}
      title={modalConfig[trueKey as keyof typeof modalConfig].title}
      size="xl"
    >
      {components[trueKey as keyof typeof components]}
    </Modal>
  )
}
