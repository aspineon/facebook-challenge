import { connect } from 'react-redux'
import {
  compose,
  withHandlers,
  setDisplayName,
  withStateHandlers,
  lifecycle
} from 'recompose'
import { withFirestore } from 'react-redux-firebase'
import { UserIsAuthenticated } from 'utils/router'
import { spinnerWhileLoading } from 'utils/components'
import { withStyles } from '@material-ui/core/styles'
import styles from './HomePage.styles'

const collection = 'posts'
const limit = 5
const orderBy = ['createdAt', 'desc']
const populates = [{ child: 'createdBy', root: 'users' }]

export default compose(
  setDisplayName('EnhancedHomePage'),
  UserIsAuthenticated,
  withFirestore,
  withStateHandlers(
    () => ({
      selectedScopeFilter: null,
      hasMorePosts: false,
      loadingPosts: true,
      loadedPosts: []
    }),
    {
      setSelectedScopeFilter: () => selectedScopeFilter => ({
        selectedScopeFilter
      }),
      setHasMorePosts: () => hasMorePosts => ({
        hasMorePosts
      }),
      setLoadingPosts: () => loadingPosts => ({
        loadingPosts
      })
    }
  ),
  lifecycle({
    async componentDidMount() {
      try {
        await this.props.firestore.setListener({
          collection,
          orderBy,
          limit,
          populates
        })

        this.props.setLoadingPosts(false)
      } catch (error) {
        console.log(error.message || error) // eslint-disable-line no-console
      }
    }
  }),
  // Map posts from state to props
  connect((state, props) => {
    const posts = state.firestore.ordered[collection]

    if (!props.hasMorePosts && posts && posts.length > limit - 1) {
      props.setHasMorePosts(true)
    }

    return { posts }
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
      setHasMorePosts,
      hasMorePosts,
      loadingPosts,
      setLoadingPosts
    }) => async () => {
      const lastPost = posts && posts[posts.length - 1]

      if (!lastPost || !hasMorePosts || loadingPosts) {
        console.log('No more posts') // eslint-disable-line no-console
        return null
      }

      try {
        setLoadingPosts(true)

        const startAfter = await firestore
          .collection('posts')
          .doc(lastPost.id)
          .get()

        const next = await firestore.get({
          collection,
          orderBy,
          limit,
          startAfter,
          populates
        })

        if (next && next.docs && next.docs.length <= limit - 1) {
          setHasMorePosts(false)
        }
      } catch (error) {
        console.log(error.message || error) // eslint-disable-line no-console
      }

      setLoadingPosts(false)
    }
  }),
  withStyles(styles)
)
