import React from "react";
import { PropTypes } from "prop-types";
import Planet from "../bodies/Planet";

import "./Neptune.scss";

const NeptuneConsts = {
    radius: 24764,
    distance: 4495100000,
    orbitalPeriod: 59800
};

const Neptune = ({ scrollToRef }) => (
    <Planet name="neptune" planetConstants={NeptuneConsts} scrollToRef={scrollToRef} />
);

Neptune.propTypes = {
    scrollToRef: PropTypes.shape({}).isRequired
};

export default Neptune;
