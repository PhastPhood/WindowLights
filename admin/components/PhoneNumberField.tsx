import * as React from 'react';

import TextButton from './TextButton';

interface PhoneNumberFieldProps {
  phoneNumber: string;
  displayName?: string;
}

export default function PhoneNumberField(props: PhoneNumberFieldProps) {
  return (
    <div className="PhoneNumberField">
      <span className="PhoneNumberField__Label">{ (props.displayName && props.displayName.length !== 0) ? 
          props.displayName : props.phoneNumber }</span>
      <TextButton phoneNumber={ props.phoneNumber }/>
    </div>
  );
}