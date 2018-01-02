import * as React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import { distanceInWordsToNow, format, isBefore } from 'date-fns';
import { capitalize } from 'lodash';

import { Text } from '../redux/model';
import { fetchTexts, changeRejectText } from '../redux/reducer';
import SwitchField from './SwitchField';
import PhoneNumberField from './PhoneNumberField';

interface TextLogStateProps {
  texts: Text[];
}

interface TextLogDispatchProps {
  fetchTexts: () => void;
  changeRejectText: (text, reject) => void;
}

class TextLog extends React.Component<TextLogStateProps & TextLogDispatchProps, any> {
  render() {
    const columns = [{
      Header: 'Number',
      accessor: 'phoneNumber',
      Cell: row => <PhoneNumberField phoneNumber={ row.value } displayName={ row.original.displayName }/>,
      width: 150
    }, {
      Header: 'Message',
      accessor: 'message',
      Cell: row => {
        const currentTime = Date.now();
        const isRunning = isBefore(currentTime, row.original.endTime);
        return <span className={ isRunning ? 'TextLog__MessageField--Running' : '' }>{ row.value }</span>
      }
    }, {
      Header: 'Rejected',
      id: 'rejected',
      accessor: text => text.rejected ? 'Rejected!' : 'Not rejected',
      Cell: row => <SwitchField
        switch={ row.original.rejected }
        switchOffText="Not rejected"
        switchOnText="Rejected!" 
        dispatchFunction={ newState => this.props.changeRejectText(row.original, newState) }/>,
      maxWidth: 150
    }, {
      Header: 'Start time',
      id: 'startTime',
      accessor: text => format(text.startTime),
      Cell: row => <span>{ capitalize(distanceInWordsToNow(row.original.startTime)) + ' ago' }</span>,
      maxWidth: 150,
      sortMethod: (a, b) => {
        const aDate = new Date(a);
        const bDate = new Date(b);
        if (aDate === bDate) {
          return 0;
        }
        return aDate > bDate ? 1 : -1;
      }
    }];

    return (
      <div>
        <ReactTable columns={ columns }
          data={ this.props.texts }
          filterable
          onFetchData={ this.props.fetchTexts }
          defaultSorted={[
            {
              id: "startTime",
              desc: true
            }
          ]}>
        </ReactTable>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    texts: state.texts
  }
};

const mapDispatchToProps: TextLogDispatchProps = {
  fetchTexts: fetchTexts,
  changeRejectText: changeRejectText };

export default connect(mapStateToProps, mapDispatchToProps)(TextLog);
