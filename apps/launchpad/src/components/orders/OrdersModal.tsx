import { Modal } from '@centrifuge/ui'
import { ApproveRedemptions } from './ApproveRedemptions'

const modalConfig = {
  approve: {
    title: 'Approve investments',
    buttonText: 'Approve',
  },
  redeem: {
    title: 'Issue shares',
    buttonText: 'Issue',
  },
  issue: {
    title: 'Aprove redemptions',
    buttonText: 'Approve',
  },
  revoke: {
    title: 'Revoke shares',
    buttonText: 'Revoke',
  },
}

export const OrdersModal = ({
  modal,
  setModal,
}: {
  modal: { approve: boolean; redeem: boolean; issue: boolean; revoke: boolean }
  setModal: (modal: { approve: boolean; redeem: boolean; issue: boolean; revoke: boolean }) => void
}) => {
  // Basically check if any value is true so we can return the title and right config
  const trueKey = Object.keys(modal).find((key) => modal[key as keyof typeof modal] === true)

  const components = {
    approve: <ApproveRedemptions />,
    redeem: <ApproveRedemptions />,
    issue: <ApproveRedemptions />,
    revoke: <ApproveRedemptions />,
  }

  if (!trueKey) return null

  return (
    <Modal
      isOpen={modal[trueKey as keyof typeof modal]}
      onClose={() => setModal({ approve: false, redeem: false, issue: false, revoke: false })}
      title={modalConfig[trueKey as keyof typeof modalConfig].title}
      size="xl"
      primaryActionText={modalConfig[trueKey as keyof typeof modalConfig].buttonText}
      onPrimaryAction={() => {
        console.log('primaryAction')
      }}
    >
      {components[trueKey as keyof typeof components]}
    </Modal>
  )
}
