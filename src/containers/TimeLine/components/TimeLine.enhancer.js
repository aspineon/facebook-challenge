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
import { spinnerWhileLoading } from 'utils/components'

export default compose(
  setDisplayName('EnhancedTimeLine'),
  withNotifications,
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  spinnerWhileLoading(['uid']),
  connect(
    ({ posts, firebase }, { uid }) => ({
      posts: posts.map(post => ({
        ...post,
        isAuthUserOwner: uid === post.createdBy
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
      filter: 'PUBLIC',
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
      showError,
      uid
    }) => async () => {
      const lastPostId = posts.length > 0 && posts[posts.length - 1].id

      if (!lastPostId) {
        console.log('No more posts') // eslint-disable-line no-console
        return
      }

      let queryParams = { lastPostId, where: [['scope', '==', filter]] }

      if (filter === 'FRIENDS') {
        queryParams.where.push(['friends', 'array-contains', uid])
      } else if (filter === 'MINE') {
        queryParams.where = ['createdBy', '==', uid]
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
    handleFilter: ({
      getPostsFirestore,
      setState,
      showError,
      uid
    }) => async filter => {
      if (!['FRIENDS', 'PUBLIC', 'MINE'].includes(filter)) {
        return
      }

      let queryParams = { where: [['scope', '==', filter]] }

      if (filter === 'FRIENDS') {
        queryParams.where.push(['friends', 'array-contains', uid])
      } else if (filter === 'MINE') {
        queryParams.where = ['createdBy', '==', uid]
      }

      setState({ initialLoading: true })

      try {
        const next = await getPostsFirestore(queryParams)

        if (next && next.docs && next.docs.length > queryConfig.limit - 1) {
          setState({
            hasMorePosts: true,
            initialLoading: false,
            filter
          })

          return
        }

        setState({
          initialLoading: false,
          filter
        })
      } catch (error) {
        console.error('Error al obtener posts: ', error.message || error) // eslint-disable-line no-console

        showError('Error al obtener posts: ', error.message || error)
        setState({ initialLoading: false })
      }
    },
    deletePost: ({ deletePostFireStore, showSuccess, showError }) => id => {
      try {
        deletePostFireStore(id)

        showSuccess('Post eliminado!')
      } catch (error) {
        console.error('Error al obtener posts: ', error.message || error) // eslint-disable-line no-console

        showError('Error al obtener posts: ', error.message || error)
      }
    }
  }),
  lifecycle({
    async componentDidMount() {
      try {
        const next = await this.props.getPostsFirestore({
          where: ['scope', '==', this.props.filter]
        })

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
