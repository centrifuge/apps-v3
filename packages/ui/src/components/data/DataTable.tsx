import React from 'react'
import { Button, Table, useToken } from '@chakra-ui/react'
import { FiCode } from 'react-icons/fi'

export type ColumnDefinition<RowType> = {
  header: string
  accessor: keyof RowType
  textAlign?: 'start' | 'center' | 'end'
  width?: string
  sortKey?: string
  render?: (row: RowType) => React.ReactNode
}

export type OrderBy = 'asc' | 'desc'

interface DataTableProps<RowType extends { id?: string | number }> {
  columns: ColumnDefinition<RowType>[]
  data: RowType[]
  size?: 'sm' | 'md' | 'lg'
  defaultSortKey?: string
  defaultSortOrder?: OrderBy
  pageSize?: number
  page?: number
}

const TABLE_HEADER_COLOR = '#F9FAFB'

export const DataTable = <RowType extends { id?: string | number; actions?: (row: RowType) => React.ReactNode }>({
  columns,
  data,
  size = 'sm',
  pageSize = Infinity,
  page = 1,
}: DataTableProps<RowType>) => {
  const [backgroundSecondary] = useToken('colors', 'border-primary')
  const [orderBy, setOrderBy] = React.useState<Record<string, OrderBy>>({})
  const [currentSortKey, setCurrentSortKey] = React.useState('')

  const updateSortOrder = (sortKey: ColumnDefinition<RowType>['sortKey']) => {
    if (!sortKey) return
    const updatedOrderBy = orderBy[sortKey] === 'desc' ? 'asc' : 'desc'
    setOrderBy({ [sortKey]: updatedOrderBy })
    setCurrentSortKey(sortKey)
  }

  const sortedAndPaginatedData = React.useMemo(() => {
    const sortedData = sorter([...data], orderBy[currentSortKey], currentSortKey)
    return sortedData.slice((page - 1) * pageSize, page * pageSize)
  }, [orderBy, data, currentSortKey, page, pageSize])

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
            <Table.ColumnHeader
              key={String(col.accessor)}
              textAlign={col.textAlign || 'start'}
              width={col.width}
              onClick={() => updateSortOrder(col.sortKey)}
              style={{ cursor: 'pointer' }}
            >
              {col.header}
              {col.sortKey && (
                <Button
                  variant="ghost"
                  size="sm"
                  _hover={{ bg: 'transparent', boxShadow: 'none' }}
                  style={{
                    color: '#82888D',
                  }}
                >
                  <FiCode
                    style={{
                      display: 'inline',
                      width: '12px',
                      height: '18px',
                      color: '#82888D',
                      transform: 'rotate(90deg)',
                    }}
                  />
                </Button>
              )}
            </Table.ColumnHeader>
          ))}
          <Table.ColumnHeader key={'actions'} textAlign={'center'} width={'50px'} style={{ cursor: 'pointer' }}>
            {' '}
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {sortedAndPaginatedData.map((row, rowIndex) => (
          <Table.Row key={row.id ?? rowIndex}>
            {columns.map((col) => {
              const rawValue = row[col.accessor]
              return (
                <Table.Cell
                  key={String(col.accessor)}
                  textAlign={col.textAlign || 'start'}
                  fontFamily="inter"
                  width={col.width}
                >
                  {col.render ? col.render(row) : String(rawValue ?? '')}
                </Table.Cell>
              )
            })}

            <Table.Cell textAlign={'center'} width={'50px'} style={row.actions && { cursor: 'pointer' }}>
              {row.actions ? row.actions(row) : ' '}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}

const sorter = <T extends Record<string, unknown>>(data: Array<T>, order: OrderBy, sortKey?: string) => {
  if (!sortKey) return data
  const up = order === 'asc' ? 1 : -1
  const down = order === 'asc' ? -1 : 1

  return data.sort((a, b) => {
    const A = a[sortKey]
    const B = b[sortKey]

    if (A == null && B == null) return 0
    if (A == null) return down
    if (B == null) return up

    if (typeof A === 'number' && typeof B === 'number') {
      return A > B ? up : down
    }

    const aStr = String(A).toLowerCase()
    const bStr = String(B).toLowerCase()

    return aStr > bStr ? up : down
  })
}
