import { Table } from '@chakra-ui/react'
import { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: ReactNode
  accessor?: keyof T
  render?: (row: T) => ReactNode
  isNumeric?: boolean
  minW?: string | number
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
}

export function DataTable<T extends object>({ columns, data, onRowClick }: DataTableProps<T>) {
  return (
    <Table.Root size="sm">
      <Table.Header>
        <Table.Row>
          {columns.map((col) => (
            <Table.ColumnHeader key={col.key} minW={col.minW} fontSize="sm" fontWeight="medium">
              {col.header}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.map((row, i) => (
          <Table.Row key={i} onClick={() => onRowClick?.(row)} _hover={onRowClick ? { cursor: 'pointer' } : {}}>
            {columns.map((col) => {
              const content = col.render ? col.render(row) : (row[col.accessor!] as unknown as ReactNode)

              return (
                <Table.Cell key={col.key} minW={col.minW} fontSize="sm">
                  {content}
                </Table.Cell>
              )
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
