import { connect } from 'react-redux'
import {
  setDisplayName,
  lifecycle,
  compose,
  withHandlers,
  withStateHandlers
} from 'recompose'
import {
  getPostsFirestore,
  addPostFireStore,
  deletePostFireStore
} from '../actions'
import { withNotifications } from 'modules/notification'
import { withStyles } from '@material-ui/core/styles'
import styles from './TimeLine.styles'
import queryConfig from '../config'

export default compose(
  setDisplayName('EnhancedTimeLine'),
  withNotifications,
  connect(
    ({ posts, firebase }) => ({
      posts: posts.map(post => ({
        ...post,
        isAuthUserOwner: firebase.auth.uid === post.createdBy
      }))
    }),
    {
      getPostsFirestore,
      addPostFireStore,
      deletePostFireStore
    }
  ),
  withStateHandlers(
    () => ({
      filter: null,
      initialLoading: true,
      nextLoading: false,
      hasMorePosts: false
    }),
    {
      setState: () => params => params
    }
  ),
  withHandlers({
    getNextPosts: ({
      getPostsFirestore,
      setState,
      posts,
      filter,
      showError
    }) => async () => {
      const lastPostId = posts.length > 0 && posts[posts.length - 1].id

      if (!lastPostId) {
        console.log('No more posts') // eslint-disable-line no-console
        return
      }

      let queryParams = { lastPostId }

      if (filter) {
        queryParams.where = ['scope', '==', filter]
      }

      setState({ nextLoading: true })

      try {
        const next = await getPostsFirestore(queryParams)

        if (next && next.docs && next.docs.length <= queryConfig.limit - 1) {
          setState({ hasMorePosts: false, nextLoading: false })

          return
        }
      } catch (error) {
        console.error('Error al obtener posts: ', error.message || error) // eslint-disable-line no-console

        showError('Error al obtener posts: ', error.message || error)
      }

      setState({ nextLoading: false })
    },
    deletePost: ({ deletePostFireStore, showSuccess, showError }) => id => {
      try {
        deletePostFireStore(id)

        showSuccess('Post eliminado!')
      } catch (error) {
        console.error('Error al obtener posts: ', error.message || error) // eslint-disable-line no-console

        showError('Error al obtener posts: ', error.message || error)
      }
    },
    handleFilter: ({
      getPostsFirestore,
      setState,
      showError
    }) => async filter => {
      if (filter !== 'FRIENDS' && filter !== 'PUBLIC') {
        return
      }

      setState({ initialLoading: true })

      try {
        const next = await getPostsFirestore({ where: ['scope', '==', filter] })

        if (next && next.docs && next.docs.length > queryConfig.limit - 1) {
          setState({
            hasMorePosts: true,
            initialLoading: false,
            filter
          })

          return
        }
      } catch (error) {
        console.error('Error al obtener posts: ', error.message || error) // eslint-disable-line no-console

        showError('Error al obtener posts: ', error.message || error)
      }

      setState({ initialLoading: false })
    }
  }),
  lifecycle({
    async componentDidMount() {
      try {
        const next = await this.props.getPostsFirestore()

        if (next && next.docs && next.docs.length > queryConfig.limit - 1) {
          this.props.setState({ hasMorePosts: true, initialLoading: false })

          return
        }
      } catch (error) {
        console.error('Error al obtener posts: ', error.message || error) // eslint-disable-line no-console

        this.props.showError('Error al obtener posts: ', error.message || error)
      }

      this.props.setState({ initialLoading: false })
    }
  }),
  withStyles(styles)
)
