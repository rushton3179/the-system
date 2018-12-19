import React from "react";
import PropTypes from "prop-types";
import { SunConsts } from "../celestial-bodies/Sun";
import { MarsConsts } from "../celestial-bodies/Mars";
import { JupiterConsts } from "../celestial-bodies/Jupiter";

import "./TheBelt.scss";

const ROCK_COUNT = 10000;

const BeltRock = ({ x, y, luminosity, size, beltRadius }) => {
    const left = beltRadius + x;
    const top = beltRadius + y;
    const style = {
        backgroundColor: "rgb(210, 210, 210)",
        height: size,
        left: `${left}px`,
        opacity: luminosity,
        position: "absolute",
        top: `${top}px`,
        width: size
    };

    return <div className="belt-rock" style={style} />;
};

BeltRock.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    luminosity: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    beltRadius: PropTypes.number.isRequired
};

class TheBelt extends React.Component {
    constructor(props) {
        super(props);
        const { multipliers } = props;
        const { distanceMultiplier, sunSizeMultiplier, sizeMultiplier } = multipliers;
        const outerMars =
            MarsConsts.distance * distanceMultiplier +
            SunConsts.radius * sunSizeMultiplier +
            MarsConsts.radius * sizeMultiplier;
        const innerJupiter =
            JupiterConsts.distance * distanceMultiplier +
            SunConsts.radius * sunSizeMultiplier -
            JupiterConsts.radius * sizeMultiplier;

        this.innerBelt = outerMars + (innerJupiter - outerMars) * 0.1;
        this.outerBelt = outerMars + (innerJupiter - outerMars) * 0.7;
        this.beltSize = this.outerBelt - this.innerBelt;
    }

    renderBelt() {
        const rocks = [];

        for (let i = 0; i < ROCK_COUNT / 2; i += 1) {
            const distance = this.innerBelt + this.beltSize * Math.sin(Math.PI * Math.random());
            const theta = Math.random() * 360;
            const vals = {
                x: distance * Math.cos(theta),
                y: distance * -Math.sin(theta),
                luminosity: 0.5 * (1 + Math.random()),
                size: 2 * Math.random(),
                beltRadius: this.outerBelt
            };
            rocks.push(<BeltRock {...vals} key={`belt-rock-${i}`} />);
        }

        return rocks;
    }

    render() {
        const { systemRadius } = this.props;
        const style = {
            height: this.outerBelt * 2,
            left: `calc(${systemRadius}px - ${this.outerBelt}px)`,
            top: `calc(${systemRadius}px - ${this.outerBelt}px)`,
            width: this.outerBelt * 2
        };

        return (
            <div className="the-belt">
                <div className="the-belt-1st-layer" style={style}>
                    {this.renderBelt()}
                </div>
                <div className="the-belt-2nd-layer" style={style}>
                    {this.renderBelt()}
                </div>
            </div>
        );
    }
}

TheBelt.propTypes = {
    multipliers: PropTypes.objectOf(PropTypes.number).isRequired,
    systemRadius: PropTypes.number.isRequired
};

export default TheBelt;
