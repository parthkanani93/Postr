import styled from 'styled-components'

const Para = styled.p`
  text-align: center;
  padding: 1rem 0.5rem;

  &.success {
    color: var(--success);
  }

  &.error {
    color: var(--error);
  }
`

export default function AuthMessage({ type, text }) {
  return <Para className={type}>{text}</Para>
}
