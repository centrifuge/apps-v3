import styled from 'styled-components'

export const Divider = styled('hr')`
  margin: 0;
  border-top-width: 1px;
  border-right-width: 0;
  border-bottom-width: 0;
  border-left-width: 0;
  border-top-style: solid;
`

Divider.defaultProps = {
  color: 'borderPrimary',
}
