import { Button, Menu, Portal } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { FiMoreVertical } from 'react-icons/fi'

type MenuItem = {
  label: string
  element: ReactNode
}

const ActionsDropdown = ({ items }: { items: MenuItem[] }) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          _hover={{ bg: 'transparent', boxShadow: 'none' }}
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#F6F6F6',
            margin: '0 auto',
            padding: '8px',
            borderRadius: '4px',
          }}
        >
          <FiMoreVertical />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {items.map((item, index) => (
              <Menu.Item
                key={index}
                value={item.label}
                _hover={{ bg: '#F9FAFB', cursor: 'pointer' }}
                style={{ minWidth: '226px', padding: '16px' }}
              >
                {item.element}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

export { ActionsDropdown }
