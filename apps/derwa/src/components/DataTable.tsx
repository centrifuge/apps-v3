import React from 'react'
import { Table, useToken } from '@chakra-ui/react'

export type ColumnDefinition<RowType> = {
  header: string
  accessor: keyof RowType
  textAlign?: 'start' | 'center' | 'end'
  render?: (value: any, row: RowType) => React.ReactNode
}

interface DataTableProps<RowType extends { id?: string | number }> {
  columns: ColumnDefinition<RowType>[]
  data: RowType[]
  size?: 'sm' | 'md' | 'lg'
}

const TABLE_HEADER_COLOR = '#F9FAFB'

const DataTable = <RowType extends { id?: string | number }>({
  columns,
  data,
  size = 'sm',
}: DataTableProps<RowType>) => {
  const [backgroundSecondary] = useToken('colors', 'border-primary')
  return (
    <Table.Root
      size={size}
      style={{
        border: `1px solid ${backgroundSecondary}`,
      }}
    >
      <Table.Header>
        <Table.Row
          style={{
            backgroundColor: TABLE_HEADER_COLOR,
          }}
        >
          {columns.map((col) => (
            <Table.ColumnHeader key={String(col.accessor)} textAlign={col.textAlign || 'start'}>
              {col.header}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.map((row, rowIndex) => (
          <Table.Row key={row.id ?? rowIndex}>
            {columns.map((col) => {
              const rawValue = row[col.accessor]
              return (
                <Table.Cell key={String(col.accessor)} textAlign={col.textAlign || 'start'}>
                  {col.render ? col.render(rawValue, row) : String(rawValue ?? '')}
                </Table.Cell>
              )
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}

export default DataTable
