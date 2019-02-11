import React from 'react'
import PropTypes from 'prop-types'
import PostBuilder from 'containers/PostBuilder'
import TimeLine from 'containers/TimeLine/components'

const Home = ({ classes }) => (
  <div className={classes.root}>
    <div className={classes.section}>
      <h2 className={classes.title}>Facebook Challenge</h2>
    </div>

    <div className={classes.section}>
      <PostBuilder />
    </div>

    <div className={classes.section}>
      <TimeLine />
    </div>
  </div>
)

Home.proptypes = {
  classes: PropTypes.object.isRequired
}

export default Home
