import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  position: relative;
  box-sizing: border-box;

  span {
    position: absolute;
    pointer-events: none;
    left: 10px;
    top: 15px;
    transition: 0.2s ease all;
    color: var(--darkGrey);
    font-weight: bold;
  }

  input {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    padding: 5px 6px;
    padding-top: 20px;
    outline: none;
    border-radius: 5px;
    border: 1px solid var(--darkGrey);
  }

  input:focus + span,
  input:not(:focus):valid + span,
  input:not([value='']) + span {
    top: 6px;
    bottom: 10px;
    left: 8px;
    font-size: 11px;
    opacity: 1;
    color: var(--primary);
  }

  input:focus {
    border: solid 2px var(--primary);
  }
`

export default function SpecialInput({
  inputValue,
  setInputValue,
  placeholder,
  ...rest
}) {
  return (
    <Container>
      <input
        {...rest}
        value={inputValue}
        onChange={({ target }) => setInputValue(target.value)}
        required
      />
      <span>{placeholder}</span>
    </Container>
  )
}
