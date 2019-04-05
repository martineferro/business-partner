import React, { PropTypes, Component } from 'react';
import { BusinessPartner } from '../../../api';
import { Async } from '@opuscapita/react-select';
import translations from '../../../i18n';

let getOption = function(businessPartner) {
  if (!businessPartner) return null;

  return { label: businessPartner.name, value: businessPartner.id };
};

export default class Autocomplete extends Component {
  constructor(props) {
    super(props);
    this.api = new BusinessPartner();

    this.state = { value: getOption(props.value), businessPartners: [] };
  }

  static propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFilter : PropTypes.func.isRequired
  };

  static defaultProps = { value: null, disabled: false, onFilter: (val) => val  };

  static contextTypes = {
    i18n: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    this.context.i18n.register('BusinessPartner', translations);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n) nextContext.i18n.register('BusinessPartner', translations);

    this.setState({ value: getOption(nextProps.value) });
  }

  onChange = (option) => {
    let supplier = null;
    if (option) supplier = this.state.businessPartners.find(bp => bp.id === option.value);
    if (this.props.onChange) this.props.onChange(supplier);

    this.setState({ value: option });
  };

  filterBusinessPartners = async inputValue => {
    const search = inputValue ? { name: inputValue } : {};
    const businessPartners = await this.api.all(search);

    await this.setState({ businessPartners })

    return businessPartners.filter(this.props.onFilter).map(bp => getOption(bp)).filter(option => {
      return option.label.toLowerCase().includes(inputValue.toLowerCase());
    });
  }

  promiseOptions = inputValue => this.filterBusinessPartners(inputValue);

  render() {
    const { i18n } = this.context;
    return (
      <Async
        loadOptions={this.promiseOptions}
        value={this.state.value}
        isDisabled={this.props.disabled}
        onChange={this.onChange}
        onBlur={this.props.onBlur}
        placeholder={i18n.getMessage("BusinessPartner.Autocomplete.placeholder")}
        noOptionsMessage={() => i18n.getMessage("BusinessPartner.Autocomplete.noResultsText")}
        loadingMessage={() => i18n.getMessage("BusinessPartner.Autocomplete.loadingPlaceholder")}
      />
    );
  }
}
