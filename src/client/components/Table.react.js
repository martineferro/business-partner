import React, { Component, PropTypes } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default class Approval extends Component {
  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  static defaultProps = {
    defaultPageSize: 10,
    className: 'table'
  };

  render() {
    const { i18n } = this.context;

    return (
        <ReactTable
          {...this.props}
          previousText={i18n.getMessage('BusinessPartner.Table.previousPage')}
          nextText={i18n.getMessage('BusinessPartner.Table.nextPage')}
          noDataText={i18n.getMessage('BusinessPartner.Table.noDataText')}
          loadingText={i18n.getMessage('BusinessPartner.Table.loadingText')}
          pageText={i18n.getMessage('BusinessPartner.Table.pageText')}
          ofText={i18n.getMessage('BusinessPartner.Table.ofText')}
          rowsText={i18n.getMessage('BusinessPartner.Table.rowsText')}
        />
    );
  }
};
