import * as React from 'react'
import styled from 'styled-components'

export const TextLink = styled.span`
  position: relative;
  color: inherit;
  text-decoration: underline;
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  &:visited,
  &:active {
    color: inherit;
  }
  &:focus-visible {
    text-decoration: none;
    &::before {
      content: '';
      display: block;
      position: absolute;
      bottom: -1px;
      width: 100%;
      height: 2px;
      background-color: var(--fabric-focus);
      pointer-events: none;
    }
  }
`

export function AnchorTextLink(props: React.ComponentPropsWithoutRef<'a'>) {
  return <TextLink as="a" target="_blank" rel="noopener noreferrer" {...props} />
}
