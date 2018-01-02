import * as React from 'react';

interface InputFieldProps {
  value: string;
  dispatchFunction: (newValue: string) => void;
  className?: string;
}

interface InputFieldState {
  value: string;
}

export default class InputField extends React.Component<InputFieldProps, InputFieldState> {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value };
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleBlur(event) {
    this.props.dispatchFunction(this.state.value);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  };

  render() {
    const className = this.props.className ? 'InputTextField ' + this.props.className : 'InputTextField';
    return (
      <input type="text"
          value={ this.state.value }
          className={ className }
          onChange={ this.handleChange }
          onBlur={ this.handleBlur }/>
    );
  }
}
