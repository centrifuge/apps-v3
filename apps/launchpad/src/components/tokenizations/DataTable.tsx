import React from 'react'
import { Table, useToken } from '@chakra-ui/react'

export type ColumnDefinition<RowType> = {
  header: string
  accessor: keyof RowType | string
  textAlign?: 'start' | 'center' | 'end'
  render?: (row: RowType) => React.ReactNode
}

interface DataTableProps<RowType extends { id?: string | number }> {
  columns: ColumnDefinition<RowType>[]
  data: RowType[]
  size?: 'sm' | 'md' | 'lg'
  width?: string | number
}

const TABLE_HEADER_COLOR = '#F9FAFB'

const DataTable = <RowType extends { id?: string | number }>({
  columns,
  data,
  size = 'sm',
  width = 'auto',
}: DataTableProps<RowType>) => {
  const [borderColor] = useToken('colors', 'border-primary')

  return (
    <Table.Root
      size={size}
      width={width}
      style={{
        border: `1px solid ${borderColor}`,
        tableLayout: typeof width === 'string' && width.endsWith('%') ? undefined : 'fixed',
      }}
    >
      <Table.Header>
        <Table.Row backgroundColor={TABLE_HEADER_COLOR}>
          {columns.map((col) => (
            <Table.ColumnHeader
              key={String(col.accessor)}
              textAlign={col.textAlign ?? 'start'}
              color="gray.500"
              fontSize="xs"
            >
              {col.header}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.map((row, rowIndex) => (
          <Table.Row key={row.id ?? rowIndex}>
            {columns.map((col) => {
              const rawValue = (row as any)[col.accessor]
              return (
                <Table.Cell key={String(col.accessor)} textAlign={col.textAlign ?? 'start'}>
                  {col.render ? col.render(row) : String(rawValue ?? '')}
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
