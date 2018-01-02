import * as React from 'react';

import TextButton from './TextButton';

interface PhoneNumberFieldProps {
  phoneNumber: string;
}

export default function PhoneNumberField(props: PhoneNumberFieldProps) {
  return (
    <div className="PhoneNumberField">
      <span>{ props.phoneNumber }</span>
      <TextButton phoneNumber={ props.phoneNumber }/>
    </div>
  );
}