import React from "react";
import PropTypes from "prop-types";
import Planet from "./Planet";
import { MercuryConsts } from "./CelestialBodiesConstants";
import "./Planets.css";

const Mercury = props => {
    const { multipliers, systemRadius } = props;
    const name = "mercury";

    return (
        <Planet
            name={name}
            multipliers={multipliers}
            planetConstants={MercuryConsts}
            systemRadius={systemRadius}
        />
    );
};

Mercury.propTypes = {
    multipliers: PropTypes.objectOf(PropTypes.number).isRequired,
    systemRadius: PropTypes.number.isRequired
};

export default Mercury;
