import { Modal } from '@centrifuge/ui'
import { modalConfig } from './modalConfig'
import { PendingAmount } from '@centrifuge/shared/src/types/shareClassTypes'

export const OrdersModal = ({
  modal,
  setModal,
  orders,
}: {
  modal: { approve: boolean; redeem: boolean; issue: boolean; revoke: boolean }
  setModal: (modal: { approve: boolean; redeem: boolean; issue: boolean; revoke: boolean }) => void
  orders: PendingAmount[]
}) => {
  // Basically check if any value is true so we can return the title and right config
  const trueKey = Object.keys(modal).find((key) => modal[key as keyof typeof modal] === true)

  if (!trueKey) return null

  return (
    <Modal
      isOpen={modal[trueKey as keyof typeof modal]}
      onClose={() => setModal({ approve: false, redeem: false, issue: false, revoke: false })}
      title={modalConfig[trueKey as keyof typeof modalConfig].title}
      size="lg"
    >
      <div>working?</div>
    </Modal>
  )
}
