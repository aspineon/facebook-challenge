import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import PostBuilder from 'containers/PostBuilder'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import Card from '@material-ui/core/Card'
import defaultUserImageUrl from 'static/User.png'

const PostCard = ({
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
  <Card className={classes.root}>
    {editing ? (
      <PostBuilder post={post} onClose={handleDisabledEditing} />
    ) : (
      <Fragment>
        <CardHeader
          avatar={
            <Avatar
              label={post.createdBy.displayName || post.createdBy.username}
              className={classes.bigAvatar}
              src={post.createdBy.avatarUrl || defaultUserImageUrl}
            />
          }
          title={post.createdBy.displayName || post.createdBy.username}
          subheader={
            (post.createdAt && post.createdAt.toDate().toLocaleString()) || ''
          }
        />
        <CardContent>
          <Typography component="p" className={classes.message}>
            {post.message}
          </Typography>
        </CardContent>
      </Fragment>
    )}
    <CardActions className={classes.actions} disableActionSpacing>
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
    </CardActions>
    {deleteDialogOpen && (
      <Dialog
        open={deleteDialogOpen}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title">
        <DialogTitle id="confirmation-dialog-title">Eliminar post</DialogTitle>
        <DialogContent>
          ¿Estás seguro que quieres eliminar este post?
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
  </Card>
)

PostCard.proptypes = {
  editing: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
  deleteDialogOpen: PropTypes.bool.isRequired,
  handleEnabledEditing: PropTypes.func.isRequired,
  handleDisabledEditing: PropTypes.func.isRequired,
  handleOpenDialog: PropTypes.func.isRequired,
  handleDialogOk: PropTypes.func.isRequired,
  handleDialogCancel: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default PostCard
