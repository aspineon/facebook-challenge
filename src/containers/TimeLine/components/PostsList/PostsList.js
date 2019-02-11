import React from 'react'
import PropTypes from 'prop-types'
import PostCard from 'containers/PostCard'
import LoadingSpinner from 'components/LoadingSpinner'
import InfiniteScroll from 'react-infinite-scroller'
import styles from './PostsList.styles'
import { withStyles } from '@material-ui/core'

const PostsList = ({ posts, hasMore, loadMore, deletePost, classes }) => (
  <InfiniteScroll
    pageStart={0}
    hasMore={hasMore}
    initialLoad={false}
    loadMore={loadMore}
    loader={<LoadingSpinner key="loader" />}>
    <div className={classes.root}>
      {posts.map(post => (
        <div className={classes.post} key={`post-${post.id}`}>
          <PostCard post={post} onDelete={deletePost} />
        </div>
      ))}
    </div>
  </InfiniteScroll>
)

PostsList.proptypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string
    })
  ).isRequired,
  deletePost: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(PostsList)
