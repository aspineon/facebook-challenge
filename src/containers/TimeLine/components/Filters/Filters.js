import PropTypes from 'prop-types'
import React from 'react'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import styles from './Filters.styles'

const Filters = ({ classes, filter, handle }) => (
  <div className={classes.root}>
    <Button
      color="primary"
      onClick={() => handle('PUBLIC')}
      disabled={filter === 'PUBLIC'}>
      Público
    </Button>
    <Button
      color="primary"
      onClick={() => handle('FRIENDS')}
      disabled={filter === 'FRIENDS'}>
      Mis amigos
    </Button>
    <Button
      color="primary"
      onClick={() => handle('MINE')}
      disabled={filter === 'MINE'}>
      Mis Posts
    </Button>
  </div>
)

Filters.defaultProps = {
  filter: 'PUBLIC'
}

Filters.proptypes = {
  filter: PropTypes.oneOf(['FRIENDS', 'PUBLIC', 'MINE']).isRequired,
  handle: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Filters)
