import React from 'react'
import PropTypes from 'prop-types'
import PostBuilder from 'containers/PostBuilder'
import Post from 'containers/Post'
import Button from '@material-ui/core/Button'
// import InfiniteScroll from 'react-infinite-scroller'

const Home = ({
  posts,
  selectedScopeFilter,
  loadingPosts,
  hasMorePosts,
  getAllPostsByScope,
  getNextPosts,
  deletePost,
  classes
}) => (
  <div className={classes.root}>
    <div className={classes.section}>
      <h2 className={classes.title}>Facebook Challenge</h2>
    </div>
    <div className={classes.section}>
      <PostBuilder />
    </div>
    <div className={classes.section}>
      <div className={classes.actionButtons}>
        <Button
          color="primary"
          onClick={() => getAllPostsByScope('FRIENDS')}
          disabled={selectedScopeFilter === 'FRIENDS'}>
          Amigos
        </Button>
        <Button
          color="primary"
          onClick={() => getAllPostsByScope('PUBLIC')}
          disabled={selectedScopeFilter === 'PUBLIC'}>
          Público
        </Button>
      </div>
    </div>

    {/* <InfiniteScroll
        pageStart={0}
        hasMore={hasMorePosts && !loadingPosts}
        initialLoad={false}
        loadMore={getNextPosts}
        threshold={50}>
        {loadingPosts ? (
          <div className="loader" key="loading">
            Cargando ...
          </div>
        ) : null} */}
    {posts &&
      posts.map(post => (
        <div className={classes.section} key={`post-${post.id}`}>
          <Post post={post} onDelete={deletePost} />
        </div>
      ))}
    {/* </InfiniteScroll> */}
  </div>
)

Home.proptypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      message: PropTypes.string,
      scope: PropTypes.string
    })
  ).isRequired,
  deletePost: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default Home
