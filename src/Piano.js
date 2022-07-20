import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import difference from 'lodash.difference';
import ControlledPiano from './ControlledPiano';
import Keyboard from './Keyboard';

class Piano extends React.Component {
  static propTypes = {
    noteRange: PropTypes.object.isRequired,
    activeNotes: PropTypes.arrayOf(PropTypes.number.isRequired),
    selectedNotes: PropTypes.arrayOf(PropTypes.number.isRequired),
    enableSelection: PropTypes.bool,
    playNote: PropTypes.func.isRequired,
    stopNote: PropTypes.func.isRequired,
    onPlayNoteInput: PropTypes.func,
    onStopNoteInput: PropTypes.func,
    renderNoteLabel: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    width: PropTypes.number,
    keyWidthToHeight: PropTypes.number,
    keyboardShortcuts: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        midiNumber: PropTypes.number.isRequired,
      }),
    ),
  };

  state = {
    activeNotes: this.props.activeNotes || [],
    selectedNotes: this.props.selectedNotes || []
  };

  componentDidUpdate(prevProps) {
    // Make activeNotes "controllable" by using internal
    // state by default, but allowing prop overrides.
    if (
      prevProps.activeNotes !== this.props.activeNotes &&
      this.state.activeNotes !== this.props.activeNotes
    ) {
      this.setState({
        activeNotes: this.props.activeNotes || [],
      });
    }

    // Update selection state only if selection is enabled
    if (
      this.props.enableSelection &&
      prevProps.selectedNotes !== this.props.selectedNotes &&
      this.state.selectedNotes !== this.props.selectedNotes
    ) {
      this.setState({
        selectedNotes: this.props.selectedNotes || [],
      });
    }
  }

  handlePlayNoteInput = (midiNumber) => {
    this.setState((prevState) => {
      const newState = {};

      // Don't append note to activeNotes if it's already present
      if (!prevState.activeNotes.includes(midiNumber)) {
        newState.activeNotes = prevState.activeNotes.concat(midiNumber);
      }
      if (this.props.enableSelection) {
        newState.selectedNotes = prevState.selectedNotes.includes(midiNumber)
          ? prevState.selectedNotes.filter((note) => note !== midiNumber)  // remove note from selected
          : prevState.selectedNotes.concat(midiNumber);
      }

      // Need to be handled inside setState in order to set prevActiveNotes without
      // race conditions.
      if (this.props.onPlayNoteInput) {
        this.props.onPlayNoteInput(midiNumber, newState);
      }

      return newState;
    });
  };

  handleStopNoteInput = (midiNumber) => {
    this.setState((prevState) => {
      // Need to be handled inside setState in order to set prevActiveNotes without
      // race conditions.
      if (this.props.onStopNoteInput) {
        this.props.onStopNoteInput(midiNumber, { prevActiveNotes: this.state.activeNotes });
      }
      return {
        activeNotes: prevState.activeNotes.filter((note) => midiNumber !== note),
      };
    });
  };

  render() {
    const { activeNotes, onPlayNoteInput, onStopNoteInput, ...otherProps } = this.props;
    return (
      <ControlledPiano
        activeNotes={this.state.activeNotes}
        selectedNotes={this.state.selectedNotes}
        onPlayNoteInput={this.handlePlayNoteInput}
        onStopNoteInput={this.handleStopNoteInput}
        {...otherProps}
      />
    );
  }
}

export default Piano;
