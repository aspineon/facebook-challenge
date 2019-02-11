import React from 'react'
import Filters from './Filters'
import LoadingSpinner from 'components/LoadingSpinner'
import PostsList from './PostsList'
import PropTypes from 'prop-types'

const TimeLine = ({
  posts,
  initialLoading,
  nextLoading,
  hasMorePosts,
  withFilters,
  filter,
  handleFilter,
  getNextPosts,
  deletePost,
  classes
}) => {
  if (initialLoading) {
    return <LoadingSpinner />
  }

  if (posts.length === 0) {
    return <div className={classes.root}>No se econtraron posts</div>
  }

  return (
    <div className={classes.root}>
      {withFilters && <Filters filter={filter} handle={handleFilter} />}
      <PostsList
        posts={posts}
        filter={withFilters ? filter : null}
        hasMore={!nextLoading && hasMorePosts}
        loadMore={getNextPosts}
        deletePost={deletePost}
      />
    </div>
  )
}

TimeLine.defaultProps = {
  withFilters: true,
  filter: null
}

TimeLine.proptypes = {
  withFilters: PropTypes.bool,
  initialLoading: PropTypes.bool.isRequired,
  nextLoading: PropTypes.bool.isRequired,
  hasMorePosts: PropTypes.bool.isRequired,
  filter: PropTypes.string,
  handleFilter: PropTypes.func,
  getNextPosts: PropTypes.func,
  deletePost: PropTypes.func,
  classes: PropTypes.object
}

export default TimeLine
