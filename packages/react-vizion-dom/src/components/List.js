import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const itemsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.node.isRequired,
    items: (...args) => itemsPropType(...args),
  })
);

class List extends Component {
  static propTypes = {
    cx: PropTypes.func.isRequired,
    // Only required with showMore.
    translate: PropTypes.func,
    items: itemsPropType,
    renderItem: PropTypes.func.isRequired,
    selectItem: PropTypes.func,
    className: PropTypes.string,
    showMore: PropTypes.bool,
    limit: PropTypes.number,
    showMoreLimit: PropTypes.number,
    show: PropTypes.func,
    canRefine: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
  };

  state = {
    extended: false,
  };

  onShowMoreClick = () => {
    this.setState(state => ({
      extended: !state.extended,
    }));
  };

  getLimit = () => {
    const { limit, showMoreLimit } = this.props;
    const { extended } = this.state;
    return extended ? showMoreLimit : limit;
  };

  renderItem = (item, resetQuery) => {
    const itemHasChildren = item.items && Boolean(item.items.length);

    return (
      <li
        key={item.key || item.label}
        className={this.props.cx(
          'item',
          item.isRefined && 'item--selected',
          item.noRefinement && 'item--noRefinement',
          itemHasChildren && 'item--parent'
        )}
      >
        {this.props.renderItem(item, resetQuery)}
        {itemHasChildren && (
          <ul className={this.props.cx('list', 'list--child')}>
            {item.items
              .slice(0, this.getLimit())
              .map(child => this.renderItem(child, item))}
          </ul>
        )}
      </li>
    );
  };

  renderShowMore() {
    const { showMore, translate, cx } = this.props;
    const { extended } = this.state;
    const disabled = this.props.limit >= this.props.items.length;
    if (!showMore) {
      return null;
    }

    return (
      <button
        disabled={disabled}
        className={cx('showMore', disabled && 'showMore--disabled')}
        onClick={this.onShowMoreClick}
      >
        {translate('showMore', extended)}
      </button>
    );
  }

  render() {
    const { cx, items, className, canRefine } = this.props;
    const rootClassName = classNames(
      cx('', !canRefine && '-noRefinement'),
      className
    );

    // Always limit the number of items we show on screen, since the actual
    // number of retrieved items might vary with the `maxValuesPerFacet` config
    // option.
    return (
      <div className={rootClassName}>
        <ul className={cx('list', !canRefine && 'list--noRefinement')}>
          {items
            .slice(0, this.getLimit())
            .map(item => this.renderItem(item, this.resetQuery))}
        </ul>
        {this.renderShowMore()}
      </div>
    );
  }
}

export default List;
