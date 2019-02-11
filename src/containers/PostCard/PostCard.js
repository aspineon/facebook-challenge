import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
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
import CardMedia from '@material-ui/core/CardMedia'
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
    <CardHeader
      avatar={
        <Avatar
          label={post.publisher.displayName}
          className={classes.bigAvatar}
          src={post.publisher.avatarUrl || defaultUserImageUrl}
        />
      }
      title={post.publisher.displayName}
      subheader={
        typeof post.createdAt === 'number'
          ? new Date(post.createdAt).toLocaleString()
          : post.createdAt.toDate().toLocaleString()
      }
    />
    {post.image && (
      <CardMedia
        component="img"
        className={classes.media}
        image={post.image.url}
      />
    )}
    {editing ? (
      <PostBuilder
        post={post}
        onClose={handleDisabledEditing}
        withImage={false}
      />
    ) : (
      <CardContent>
        <Typography component="p" className={classes.message}>
          {post.message}
        </Typography>
      </CardContent>
    )}
    {post.isAuthUserOwner && (
      <Fragment>
        <CardActions className={classes.actions} disableActionSpacing>
          {!editing && (
            <IconButton
              aria-label="Editar post"
              onClick={handleEnabledEditing}
              className={classes.buttonLink}
              hidden={editing}>
              <EditIcon />
            </IconButton>
          )}
          <IconButton
            aria-label="Eliminar post"
            onClick={handleOpenDialog}
            disabled={deleteDialogOpen}
            className={classes.buttonLink}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
        <Dialog
          open={deleteDialogOpen}
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          aria-labelledby="confirmation-dialog-title">
          <DialogTitle id="confirmation-dialog-title">
            Eliminar post
          </DialogTitle>
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
      </Fragment>
    )}
  </Card>
)

PostBuilder.defaultProps = {
  editing: false,
  deleting: false,
  deleteDialogOpen: false
}

PostCard.proptypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    message: PropTypes.string,
    scope: PropTypes.string,
    image: PropTypes.object,
    publisher: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  handleDialogOk: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
  deleteDialogOpen: PropTypes.bool.isRequired,
  handleEnabledEditing: PropTypes.func.isRequired,
  handleDisabledEditing: PropTypes.func.isRequired,
  handleOpenDialog: PropTypes.func.isRequired,
  handleDialogCancel: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default PostCard
