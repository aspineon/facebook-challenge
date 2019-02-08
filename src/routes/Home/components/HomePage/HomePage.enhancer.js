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
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // Wait for uid to exist before going further
  spinnerWhileLoading(['uid']),
  firestoreConnect(props => [
    {
      collection,
      orderBy,
      limit,
      populates
    }
  ]),
  connect(({ firestore }, { uid }) => {
    const {
      ordered,
      data: { users }
    } = firestore
    const posts = ordered[collection]
    const postsWithCreators =
      posts &&
      posts.map(post => ({
        ...post,
        createdBy: users[post.createdBy],
        isAuthUserOwner: uid === post.createdBy
      }))
    const hasMorePosts = (posts && posts.length > limit - 1) || false

    return {
      posts: postsWithCreators,
      hasMorePosts,
      loadingPosts: isLoaded(posts)
    }
  }),
  // Show loading spinner while posts are loading
  spinnerWhileLoading(['posts']),
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
