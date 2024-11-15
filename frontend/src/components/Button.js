import styled from 'styled-components';


export const Button = styled.button`
    border-radius: 20px;
    border: 1px solid #00584d;
    background-color: #00584d;
    
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    &:active{
        transform: scale(0.95);
    }
    &:focus {
        outline: none;
    }
 `;