import PropTypes from 'prop-types'
import {
  compose,
  setDisplayName,
  withStateHandlers,
  withHandlers,
  setPropTypes
} from 'recompose'
import { withNotifications } from 'modules/notification'
import { withStyles } from '@material-ui/core/styles'
import styles from './PostCard.styles'

export default compose(
  setDisplayName('EnhancedPostCard'),
  withNotifications,
  setPropTypes({
    showSuccess: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  }),
  withStateHandlers(
    () => ({
      editing: false,
      deleteDialogOpen: false,
      deleting: false
    }),
    {
      setEditing: () => editing => ({ editing }),
      setDeleteDialogOpen: () => deleteDialogOpen => ({ deleteDialogOpen }),
      setDeleting: () => deleting => ({ deleting })
    }
  ),
  withHandlers({
    handleEnabledEditing: ({ setEditing }) => () => setEditing(true),
    handleDisabledEditing: ({ setEditing }) => () => setEditing(false),
    handleOpenDialog: ({ setDeleteDialogOpen }) => () =>
      setDeleteDialogOpen(true),
    handleDialogCancel: ({ setDeleteDialogOpen }) => () =>
      setDeleteDialogOpen(false),
    handleDialogOk: ({
      post,
      onDelete,
      showSuccess,
      setDeleting,
      showError
    }) => async () => {
      setDeleting(true)

      try {
        await onDelete(post.id)
        showSuccess('Post eliminado!')
      } catch (error) {
        showError('Error al eliminar post:', error.message || error)
      }
    }
  }),
  withStyles(styles, { withTheme: true })
)
