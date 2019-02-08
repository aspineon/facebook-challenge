import { connect } from 'react-redux'
import {
  compose,
  withHandlers,
  setDisplayName,
  withStateHandlers
} from 'recompose'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { UserIsAuthenticated } from 'utils/router'
import { spinnerWhileLoading } from 'utils/components'
import { withStyles } from '@material-ui/core/styles'
import styles from './HomePage.styles'

const collection = 'posts'
const orderBy = ['createdAt', 'desc']
const limit = 10
const populates = [{ child: 'createdBy', root: 'users' }]

export default compose(
  setDisplayName('EnhancedHomePage'),
  UserIsAuthenticated,
  withStateHandlers(
    () => ({
      selectedScopeFilter: null,
      loadedPosts: []
    }),
    {
      setSelectedScopeFilter: () => selectedScopeFilter => ({
        selectedScopeFilter
      })
    }
  ),
  firestoreConnect(props => [
    {
      collection,
      orderBy,
      limit,
      populates
    }
  ]),
  // Map posts from state to props
  connect(state => {
    const posts = state.firestore.ordered[collection]
    const postsWithCreators =
      (posts &&
        state.firestore.data.users &&
        posts.map(post => ({
          ...post,
          createdBy: state.firestore.data.users[post.createdBy]
        }))) ||
      undefined
    const hasMorePosts = (posts && posts.length > limit - 1) || false

    return {
      posts: postsWithCreators,
      hasMorePosts,
      loadingPosts: isLoaded(posts)
    }
  }),
  // Show loading spinner while posts are loading
  spinnerWhileLoading(['posts']),
  withHandlers({
    deletePost: ({ firestore }) => async id => {
      if (!id) {
        console.error('Post Id not supply') // eslint-disable-line no-console
        return
      }

      console.log(id) // eslint-disable-line no-console

      try {
        await firestore.delete({ collection: 'posts', doc: id })
      } catch (error) {
        console.error('Error:', error) // eslint-disable-line no-console
        throw error
      }
    },
    getAllPostsByScope: ({
      firestore,
      setSelectedScopeFilter
    }) => async scope => {
      if (scope !== 'FRIENDS' && scope !== 'PUBLIC') {
        return
      }

      // const selectedData =
      //   scope === 'FRIENDS' ? 'onlyFriendsPosts' : 'onlyPublicPosts'
      try {
        // firestore.unsetListeners()
        await firestore.get({
          collection,
          where: ['scope', '==', scope],
          orderBy,
          limit
          // storeAs: selectedData
        })
        setSelectedScopeFilter(scope)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error.message || error)
      }
    },
    getNextPosts: ({
      firestore,
      posts,
      loadingPosts,
      setLoadingPosts
    }) => async () => {
      const lastPost = posts && posts[posts.length - 1]

      if (!lastPost || loadingPosts) {
        console.log('No more posts') // eslint-disable-line no-console
        return null
      }

      try {
        setLoadingPosts(true)

        const startAfter = await firestore
          .collection('posts')
          .doc(lastPost.id)
          .get()

        await firestore.get({
          collection,
          orderBy,
          // limit,
          startAfter,
          populates
        })
      } catch (error) {
        console.log(error.message || error) // eslint-disable-line no-console
      }

      setLoadingPosts(false)
    }
  }),
  withStyles(styles)
)
