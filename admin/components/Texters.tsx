import * as React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';

import { Texter } from '../redux/model';
import { fetchTexters, changeBanTexter } from '../redux/reducer';
import SwitchField from './SwitchField';

interface TextersStateProps {
  texters: Texter[];
}

interface TextersDispatchProps {
  fetchTexters: () => void;
  changeBanTexter: (texter, ban) => void;
}

class Texters extends React.Component<TextersStateProps & TextersDispatchProps, any> {
  render() {
    const columns = [{
      Header: 'Number',
      accessor: 'phoneNumber',
      width: 150
    }, {
      Header: 'Tag',
      accessor: 'tag'
    }, {
      Header: 'Banned',
      id: 'banned',
      accessor: texter => texter.banned ? 'Banned!' : 'Not banned',
      Cell: row => <SwitchField
        switch={ row.original.banned }
        switchOffText="Not banned"
        switchOnText="Banned!" 
      dispatchFunction={ newState => this.props.changeBanTexter(row.original, newState) }/>,
      maxWidth: 150
    }, {
      Header: 'Number of texts',
      accessor: 'textIds.length',
      maxWidth: 150
    }]

    return (
      <div>
        <ReactTable columns={ columns }
          data={ this.props.texters }
          filterable
          onFetchData={ this.props.fetchTexters }>
        </ReactTable>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    texters: state.texters
  }
};

const mapDispatchToProps: TextersDispatchProps = {
  fetchTexters: fetchTexters,
  changeBanTexter: changeBanTexter };


export default connect(mapStateToProps, mapDispatchToProps)(Texters);
