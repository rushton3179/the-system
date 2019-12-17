import React from "react";
import PropTypes from "prop-types";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./NavMenu.scss";
import SystemContext, { systemSize } from "../../SystemContext";
import {
    doCallbackAfterElementIsVisible,
    scrollToElementIfNotVisible,
    getDistanceToTop
} from "./util/DomUtil";
import NavMenuSubsection from "./NavMenuSubsection";

class NavMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownVisible: false,
            followedPoi: null,
            infoVisible: false,
            gotoVisible: false
        };

        this.dropDownRef = React.createRef();
        this.infoRef = React.createRef();
        this.gotoRef = React.createRef();
        this.follower = null;
    }

    onInfoClick = () => {
        this.setState(prevState => ({ infoVisible: !prevState.infoVisible, gotoVisible: false }));
    };

    onGotoClick = () => {
        this.setState(prevState => ({ infoVisible: false, gotoVisible: !prevState.gotoVisible }));
    };

    onMenuClick = () => {
        this.setState(prevState => ({
            dropdownVisible: !prevState.dropdownVisible
        }));
    };

    getOnSizeChangeClick = () => {
        const { enhancedVisibility, evenSpace } = systemSize;
        const systemSizeContext = evenSpace === this.context ? enhancedVisibility : evenSpace;
        return () => this.props.toggleSystemSize(systemSizeContext);
    };

    setFollower(poi, scrollOptions) {
        this.follower = setInterval(() => scrollToElementIfNotVisible(poi.ref.current), 1000);
    }

    gotoPoiAndFollow(poi, scrollOptions) {
        poi.ref.current.scrollIntoView(scrollOptions);
        doCallbackAfterElementIsVisible(poi.ref.current, () =>
            this.setFollower(poi, scrollOptions)
        );
    }

    getPoiOnClick = poi => () => {
        const { followedPoi } = this.state;
        const { pointsOfInterest } = this.props;
        const scrollOptions = {
            behavior: "smooth",
            block: "center",
            inline: "center"
        };

        clearInterval(this.follower);

        if (poi === followedPoi) {
            this.setState({ followedPoi: null });
        } else if (poi === pointsOfInterest.sun || poi === pointsOfInterest.theBelt) {
            poi.ref.current.scrollIntoView(scrollOptions);
        } else {
            this.gotoPoiAndFollow(poi, scrollOptions);
            this.setState({ followedPoi: poi });
        }
    };

    getTransformStyle() {
        const { dropdownVisible } = this.state;
        const { current } = this.dropDownRef;

        if (!current) {
            return null;
        }

        const maxHeight = `calc(100vh - ${getDistanceToTop(current)}px)`;
        const visibleTransform = `translateX(calc(-8vw - ${current.offsetWidth}px))`;
        return {
            maxHeight,
            transform: dropdownVisible ? visibleTransform : "translateX(0px)"
        };
    }

    renderPointOfInterest(poi) {
        const { followedPoi } = this.state;
        const followedClass = followedPoi === poi ? " the-system-nav-goto-item-followed" : "";
        return (
            <div key={poi.display}>
                <div
                    className={`the-system-nav-button the-system-nav-goto-item${followedClass}`}
                    onClick={this.getPoiOnClick(poi)}
                    role="button"
                    tabIndex="0"
                >
                    {poi.display}
                </div>
            </div>
        );
    }

    renderInformation() {
        const { multipliers } = this.context;
        const {
            orbitalPeriodMultiplier,
            distanceMultiplier,
            sizeMultiplier,
            satelliteDist
        } = multipliers;

        const daysPerSecond = 1 * orbitalPeriodMultiplier;
        const kmPerPixelDistance = Math.round(1 / distanceMultiplier).toLocaleString();
        const kmPerPixelSatellite = Math.round(1 / satelliteDist).toLocaleString();
        const kmPerPixelSize = Math.round(1 / sizeMultiplier).toLocaleString();
        const normaliseButtonStatus =
            systemSize.evenSpace === this.context ? " the-system-nav-info-normalise-active" : "";

        return (
            <>
                <div className="the-system-nav-info-body-heading">Time</div>
                <div className="the-system-nav-info-body-stat">{`${daysPerSecond} s = 1 day`}</div>
                <div className="the-system-nav-info-body-heading">Distance Between Planets</div>
                <div className="the-system-nav-info-body-stat">{`1 pixel = ${kmPerPixelDistance} km`}</div>
                <div className="the-system-nav-info-body-heading">
                    Distance Between Planets And Moons
                </div>
                <div className="the-system-nav-info-body-stat">{`1 pixel = ${kmPerPixelSatellite} km`}</div>
                <div className="the-system-nav-info-body-heading">Planet Size</div>
                <div className="the-system-nav-info-body-stat">{`1 pixel = ${kmPerPixelSize} km`}</div>
                <div
                    className={`the-system-nav-info-normalise${normaliseButtonStatus}`}
                    onClick={this.getOnSizeChangeClick()}
                    role="button"
                    tabIndex="0"
                >
                    Normalise Distance
                </div>
            </>
        );
    }

    renderPointsOfInterest() {
        const { pointsOfInterest } = this.props;

        return Object.values(pointsOfInterest).map(poi => this.renderPointOfInterest(poi));
    }

    render() {
        const { infoVisible, gotoVisible } = this.state;
        const style = this.getTransformStyle();

        return (
            <div className="the-system-nav">
                <div className="the-system-nav-header">
                    <div
                        className="the-system-nav-button the-system-nav-header-button"
                        onClick={this.onMenuClick}
                        onKeyPress={this.onMenuClick}
                        role="button"
                        tabIndex="0"
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                </div>
                <div className="the-system-nav-dropdown" ref={this.dropDownRef} style={style}>
                    <NavMenuSubsection
                        onClick={this.onInfoClick}
                        headerText="Information"
                        bodyRef={this.infoRef}
                        isVisible={infoVisible}
                        content={this.renderInformation()}
                    />
                    <NavMenuSubsection
                        onClick={this.onGotoClick}
                        headerText="Navigation"
                        bodyRef={this.gotoRef}
                        isVisible={gotoVisible}
                        content={this.renderPointsOfInterest()}
                    />
                </div>
            </div>
        );
    }
}

NavMenu.propTypes = {
    pointsOfInterest: PropTypes.shape({
        sun: PropTypes.shape({}).isRequired,
        theBelt: PropTypes.shape({}).isRequired
    }).isRequired,
    toggleSystemSize: PropTypes.func.isRequired
};

NavMenu.contextType = SystemContext;

export default NavMenu;
