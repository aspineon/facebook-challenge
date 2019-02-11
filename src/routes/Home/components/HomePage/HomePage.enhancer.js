import { compose, setDisplayName } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './HomePage.styles'
import { UserIsAuthenticated } from 'utils/router'

export default compose(
  setDisplayName('EnhancedHomePage'),
  UserIsAuthenticated,
  withStyles(styles)
)
