import { Component } from 'react';
import PropTypes from 'prop-types';
import { connectGeoSearch } from '@clinia/react-vizion-dom';
import { LatLngPropType, BoundingBoxPropType } from './propTypes';

function isEqualQuery(a, b) {
  return a === b;
}

function isEqualPosition(a, b) {
  if (a === b) {
    return true;
  }
  if (a === undefined || b === undefined) {
    return false;
  }

  return a.lat === b.lat && a.lng === b.lng;
}

function isEqualCurrentRefinement(a, b) {
  if (a === b) {
    return true;
  }

  if (a === undefined || b === undefined) {
    return false;
  }

  return (
    isEqualPosition(a.northEast, b.northEast) &&
    isEqualPosition(a.southWest, b.southWest)
  );
}

export class Connector extends Component {
  static propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    isRefinedWithMap: PropTypes.bool.isRequired,
    enableRefineOnMapMove: PropTypes.bool.isRequired,
    refine: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
    position: LatLngPropType,
    currentRefinement: BoundingBoxPropType,
    query: PropTypes.string.isRequired,
  };

  static getDerivedStateFromProps(props, state) {
    const { position, currentRefinement, query } = props;
    const {
      previousPosition,
      previousCurrentRefinement,
      previousQuery,
    } = state;

    const positionChanged = !isEqualPosition(previousPosition, position);
    const currentRefinementChanged = !isEqualCurrentRefinement(
      previousCurrentRefinement,
      currentRefinement
    );
    const queryChanged = !isEqualQuery(previousQuery, query);

    const sliceNextState = {
      previousPosition: position,
      refineBounds: positionChanged || currentRefinementChanged || queryChanged,
      previousQuery: query,
      previousCurrentRefinement: currentRefinement,
    };

    if (positionChanged || currentRefinementChanged) {
      return {
        ...sliceNextState,
        hasMapMoveSinceLastRefine: false,
      };
    }

    return sliceNextState;
  }

  state = {
    isRefineOnMapMove: this.props.enableRefineOnMapMove,
    hasMapMoveSinceLastRefine: false,
    positionChanged: false,
    refineBounds: false,
    previousPosition: this.props.position,
    previousCurrentRefinement: this.props.currentRefinement,
  };

  toggleRefineOnMapMove = () =>
    this.setState(({ isRefineOnMapMove }) => ({
      isRefineOnMapMove: !isRefineOnMapMove,
    }));

  setMapMoveSinceLastRefine = next => {
    const { hasMapMoveSinceLastRefine } = this.state;

    if (hasMapMoveSinceLastRefine === next) {
      return;
    }

    this.setState(() => ({
      hasMapMoveSinceLastRefine: next,
    }));
  };

  render() {
    const {
      hits,
      isRefinedWithMap,
      position,
      currentRefinement,
      refine,
      children,
    } = this.props;

    const {
      isRefineOnMapMove,
      hasMapMoveSinceLastRefine,
      refineBounds,
    } = this.state;

    return children({
      toggleRefineOnMapMove: this.toggleRefineOnMapMove,
      setMapMoveSinceLastRefine: this.setMapMoveSinceLastRefine,
      hits,
      isRefinedWithMap,
      isRefineOnMapMove,
      hasMapMoveSinceLastRefine,
      position,
      currentRefinement,
      refineBounds,
      refine,
    });
  }
}

export default connectGeoSearch(Connector);
