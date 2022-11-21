import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Qwiket from "./qwiketDisplay";
const OutertWrap = styled.div`
    width: 800px;
    margin-top: 60px;
`;
const Qwikets = ({ qwikets }) => {
    const rows = qwikets.map(q => {
        return <Qwiket qwiket={q} />;
    });
    return <OutertWrap>{rows}</OutertWrap>;
};
export default Qwikets;
