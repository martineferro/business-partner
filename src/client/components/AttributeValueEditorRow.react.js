import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ActionButton from './ActionButton.react';

/**
 * Provides skeleton for displaying label and input field of ane types.
 */
export default class AttributeValueEditorRow extends Component {

  static propTypes = {
    labelText: PropTypes.string.isRequired,
    required: PropTypes.bool,
    rowErrors: PropTypes.array,
    onErrorLinkClick: PropTypes.func,
    marked: PropTypes.bool,
    info: PropTypes.string,
    helpText: PropTypes.string
  };

  static defaultProps = {
    required: false,
    marked: false,
    info: null,
    helpText: null,
    rowErrors: [],
  };

  errorStyles() {
    return {
      marginBottom: '0px',
      padding: '6px',
      border: '0px'
    }
  }

  renderInfo() {
    return (
      <a
        href="#"
        data-toggle="tooltip"
        data-placement="auto"
        data-html="true"
        data-title={this.props.info}
      ><i className="fa fa-info-circle fa-fw" /></a>
    );
  }

  labelTextString() {
    const { marked, info, required, labelText } = this.props;
    let text = labelText;

    if (required) { text = text + '\u00a0*'; }
    if (marked) { text = text + '\u00a0**'; }
    if (info) { text = <span>{text}{this.renderInfo()}</span>; }

    return text;
  }

  handleOnClick(error, event) {
    event.preventDefault();
    this.props.onErrorLinkClick(error);
  }

  renderButtonLink(error) {
    if (!error.hasLink) return null;

    return <ActionButton onClick={this.handleOnClick.bind(this, error)} label={error.linkMessage} isSmall={true} />;
  }

  renderHelpText() {
    if (!this.props.helpText) return null;

    return <p>{this.props.helpText}</p>;
  }

  render() {
    const { rowErrors } = this.props;

    return (
      <div
        className={classNames({
          'form-group': true,
          'has-error': !!rowErrors.length
        })}
      >
        <label className={`col-sm-4 control-label`}>
          {this.labelTextString()}
        </label>

        <div className={`col-sm-8`}>
          { this.props.children }

          {rowErrors.map((error, index) =>
            <div className="alert alert-danger" key={index} style={this.errorStyles()}>
              <p>{ error.message }</p>
              {this.renderButtonLink(error)}
            </div>
          )}
          {this.renderHelpText()}
        </div>
      </div>
    );
  }
}
