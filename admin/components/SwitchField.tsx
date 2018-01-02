import * as React from 'react';
import Switch from 'react-toggle-switch';

interface SwitchFieldProps {
  switch: boolean;
  switchOnText: string;
  switchOffText: string;
  dispatchFunction: (newState: boolean) => void;
}

interface SwitchFieldState {
  switch: boolean;
}

export default class SwitchField extends React.Component<SwitchFieldProps, SwitchFieldState> {
  constructor(props) {
    super(props);
    this.state = { switch: this.props.switch };
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }

  toggleSwitch() {
    const newState = !this.state.switch;
    this.props.dispatchFunction(newState);
    this.setState({ switch: newState });
  };

  render() {
    let labelClassName = 'Switch__Label';
    if (this.props.switch) {
      labelClassName += ' Switch__Label--Switched';
    }
    return (
      <>
        <Switch onClick={ this.toggleSwitch } on={ this.state.switch }/>
        <span className={ labelClassName }>
          { this.props.switch ? this.props.switchOnText : this.props.switchOffText }
        </span>
      </>
    );
  }
}
