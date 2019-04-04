import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class ActionButton extends Component {
  static propTypes = {
    id: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    style: PropTypes.string,
    type: PropTypes.string,
    action: PropTypes.string,
    isSmall: PropTypes.bool,
    showIcon: PropTypes.bool
  };

  static defaultProps = {
    isSmall: false,
    showIcon: false,
    style: 'default',
    type: 'button',
    onClick: () => null
  };

  renderLabelWithIcon() {
    const action = this.props.action;
    const classes = classNames({
      'glyphicon': true,
      'glyphicon-plus': action === 'add',
      'glyphicon-edit': action === 'edit',
      'glyphicon-trash': action === 'delete',
      'glyphicon-eye-open': action === 'view',
      'glyphicon-ok': action === 'approve',
      'glyphicon-remove': action === 'reject',
      'glyphicon-user': action === 'createUser'
    });
    return <div><span className={ classes }></span>&nbsp;{this.props.label}</div>;
  }

  render() {
    const { style, type, showIcon, label } = this.props;
    const buttonClassNames = classNames({
      'btn': true,
      'btn-default': style === 'default',
      'btn-primary': style === 'primary',
      'btn-link': style === 'link',
      'btn-sm': this.props.isSmall,
    });

    return (
      <button id={this.props.id} className={buttonClassNames} onClick={this.props.onClick.bind(this)} type={type}>
          {showIcon ? this.renderLabelWithIcon() : label }
      </button>
    );
  }
};
