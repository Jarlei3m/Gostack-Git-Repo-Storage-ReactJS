import styled, { keyframes, css } from 'styled-components';

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  position: relative;
`;

export const InputField = styled.input.attrs( props => ({
  type: 'text',
  placeholder: 'Add repository',
}))`

  flex: 1;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 16px;

  border: ${ props => props.notFound ? '1px solid red' : '1px solid #eee'};

`;

const translate = keyframes`
  from {
    transform: translate3d(0, -8px, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`

export const SmallMessage = styled.small`
  position: absolute;
  top: 44px;
  left: 8px;
  font-size: 11px;
  color: ${props => props.notFound ? 'rgba(233, 33, 33);' : 'rgb(99, 192, 99);'};

  ${props => props.children && css`
    animation: ${translate} .3s ease-out;
  `}
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

export const SubmitButton = styled.button.attrs( props => ({
  type: 'submit',
  disabled: props.loading,
}))`

  background: #7159c1;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props => props.loading &&
  css`
    svg {
      animation: ${rotate} 2s linear infinite;
    }
  `}
`;

export const List = styled.ul`
  margin-top: 30px;
  list-style: none;

  li {
    padding: 15px 0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    & + li {
      border-top: 1px solid #eee;
    }

    a {
      color: #7159c1;
      text-decoration: none;
    }
  }

`;
