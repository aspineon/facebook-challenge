import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import PostBuilder from 'containers/PostBuilder'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'

const Post = ({
  post,
  editing,
  deleting,
  deleteDialogOpen,
  handleEnabledEditing,
  handleDisabledEditing,
  handleDialogOk,
  handleDialogCancel,
  handleOpenDialog,
  classes
}) => (
  <div className={classes.root}>
    {editing ? (
      <PostBuilder post={post} onClose={handleDisabledEditing} />
    ) : (
      <div className={classes.message}>{post.message}</div>
    )}
    <div className={classes.actionButtons}>
      <Button
        color="primary"
        onClick={handleEnabledEditing}
        className={classes.buttonLink}
        hidden={editing}>
        Editar
      </Button>
      <Button
        color="primary"
        onClick={handleOpenDialog}
        disabled={deleteDialogOpen}
        className={classes.buttonLink}>
        Eliminar
      </Button>
    </div>
    {deleteDialogOpen && (
      <Dialog
        open={deleteDialogOpen}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title">
        <DialogTitle id="confirmation-dialog-title">Eliminar post</DialogTitle>
        <DialogContent>
          ¿Estas seguro de que quieres eliminar este post?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel} disabled={deleting}>
            Cancelar
          </Button>
          <Button onClick={handleDialogOk} disabled={deleting}>
            {deleting ? '...Eliminando' : 'Ok'}
          </Button>
        </DialogActions>
      </Dialog>
    )}
  </div>
)

Post.proptypes = {
  handleDialogOk: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default Post
