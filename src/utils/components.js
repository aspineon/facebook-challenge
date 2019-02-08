/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { pick, some } from 'lodash'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import LoadableComponent from 'react-loadable'
import { mapProps, branch, renderComponent } from 'recompose'
import LoadingSpinner from 'components/LoadingSpinner'

/**
 * Show a component while condition is true.
 *
 * @param  {Function} condition - Condition function for when to show spinner
 * @return {HigherOrderComponent}
 */
export const renderWhile = (condition, component) =>
  branch(condition, renderComponent(component))

/**
 * Show a loading spinner while props are loading . Checks
 * for undefined, null, or a value (as well as handling `auth.isLoaded` and
 * `profile.isLoaded`). **NOTE:** Meant to be used with props which are passed
 * as props from state.firebase using connect (from react-redux), which means
 * it could have unexpected results for other props
 * @example Spinner While Data Loading
 * import { compose } from 'redux'
 * import { connect } from 'react-redux'
 * import { firebaseConnect } from 'react-redux-firebase'
 *
 * const enhance = compose(
 *   firebaseConnect(['projects']),
 *   connect(({ firebase: { data: { projects } } })),
 *   spinnerWhileLoading(['projects'])
 * )
 *
 * export default enhance(SomeComponent)
 * @param  {Array} propNames - List of prop names to check loading for
 * @return {HigherOrderComponent}
 */
export const spinnerWhileLoading = propNames =>
  renderWhile(
    props => some(propNames, name => !isLoaded(props[name])),
    LoadingSpinner
  )

// HOC that shows a component while any of a list of props isEmpty
export const renderIfEmpty = (propsNames, component) => {
  return renderWhile(
    // Any of the listed prop name correspond to empty props (supporting dot path names)
    props =>
      some(propsNames, name => isLoaded(props[name]) && isEmpty(props[name])),
    component
  )
}

/**
 * HOC that logs props using console.log. Accepts an array list of prop names
 * to log, if none provided all props are logged. **NOTE:** Only props at
 * available to the HOC will be logged.
 * @example Log Single Prop
 * import { compose } from 'redux'
 * import { connect } from 'react-redux'
 * import { firebaseConnect } from 'react-redux-firebase'
 *
 * const enhance = compose(
 *   withProps(() => ({ projectName: 'test' })),
 *   logProps(['projectName']) // 'test' would be logged to console when SomeComponent is rendered
 * )
 *
 * export default enhance(SomeComponent)
 * @param  {Array} propNames - List of prop names to log. If none provided, all
 * are logged
 * @return {HigherOrderComponent}
 */
export const logProps = (propNames, logName = '') =>
  mapProps(ownerProps => {
    console.log(
      `${logName} props:`,
      propNames ? pick(ownerProps, propNames) : ownerProps
    )
    return ownerProps
  })

export function createWithFromContext(withVar) {
  return WrappedComponent => {
    class WithFromContext extends Component {
      render() {
        const props = { [withVar]: this.context[withVar] }
        if (this.context.store && this.context.store.dispatch) {
          props.dispatch = this.context.store.dispatch
        }
        return <WrappedComponent {...this.props} {...props} />
      }
    }

    WithFromContext.contextTypes = {
      [withVar]: PropTypes.object.isRequired
    }

    return WithFromContext
  }
}

/**
 * HOC that adds store to props
 * @return {HigherOrderComponent}
 */
export const withStore = createWithFromContext('store')

/**
 * Create component which is loaded async, showing a loading spinner
 * in the meantime.
 * @param {Object} opts - Loading options
 * @param {Function} opts.loader - Loader function (should return import promise)
 */
export function Loadable(opts) {
  return LoadableComponent({
    loading: LoadingSpinner,
    ...opts
  })
}
