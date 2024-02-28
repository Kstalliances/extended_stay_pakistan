import {Card, CardBody, CardHeader, CardText} from "reactstrap";
import DiscountIcon from "@mui/icons-material/Discount";
import React from "react";
import styled from "styled-components";

const Discount = styled.h5`
  color: #146eb4;
  font-size: 12px;
  padding: 3px 10px 3px 10px;
`;

const custom_style = {
    border: '1px solid #008374',
    borderRadius: '8px',
    fontSize: '12px',
    cursor: 'pointer'
}

const fontStyle = {
    fontSize: '10px',
    padding: '1px'
}

const fontSize = {
    fontSize: '12px'
}

const headingStyle = {
    backgroundColor: '#008374',
    borderTopLeftRadius: '7px',
    borderTopRightRadius: '7px',
    color: 'white',
    padding: '3px 0 3px 0'
}

export function PriceBollets({heading, sub_heading, amount, discount}) {
    return (
        <div className="mb-3 custom-card text-center" style={custom_style}>
            <p style={headingStyle} className='mb-0'>{heading}</p>
            <CardBody>
                <CardText style={{padding: '3px 10px 3px 10px'}} className='mb-0'>{sub_heading}</CardText>
                <CardText className='mb-0'><b>PKR: </b>{amount} Rupees
                    <span className="day"> <br/>(Per day)</span>
                </CardText>
                <CardText>
                    <Discount>
                        <DiscountIcon className="dicount" style={fontSize}/>
                        <b> Discount: </b>{discount}%
                    </Discount>
                </CardText>
            </CardBody>
        </div>
    )
}