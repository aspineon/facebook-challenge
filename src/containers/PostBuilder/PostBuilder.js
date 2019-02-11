import PropTypes from 'prop-types'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { ImageCropper } from 'modules/imageCropper'

const PostBuilder = ({
  post,
  withImage,
  values,
  touched,
  errors,
  isValid,
  isSubmitting,
  handleChange,
  handleBlur,
  handleSubmit,
  onClose,
  photo,
  classes
}) => (
  <form onSubmit={handleSubmit} className={classes.form}>
    <div
      className={
        photo || (post && post.imageUrl)
          ? classes.fieldsInverted
          : classes.fields
      }>
      <TextField
        id="message"
        name="message"
        placeholder={
          photo || (post && post.imageUrl)
            ? 'Añade un comentario'
            : '¿Qué estás pensando ?'
        }
        value={values.message}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.message && Boolean(errors.message)}
        multiline
        rowsMax={100}
        InputProps={{ disableUnderline: true }}
      />
      {withImage && <ImageCropper max={1} />}
    </div>
    <div className={classes.filterAndAction}>
      <TextField
        id="scope"
        name="scope"
        select
        value={values.scope}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.scope && Boolean(errors.scope)}
        className={classes.scopeInput}>
        <MenuItem value="PUBLIC">Público</MenuItem>
        <MenuItem value="FRIENDS">Amigos</MenuItem>
      </TextField>
      <Button color="primary" type="submit" disabled={!isValid || isSubmitting}>
        {post && post.id
          ? isSubmitting
            ? '...Guardando'
            : 'Guardar'
          : isSubmitting
          ? '...Compartiendo'
          : 'Compartir'}
      </Button>
      {post && <Button onClick={onClose}>Cancelar</Button>}
    </div>
  </form>
)

PostBuilder.defaultProps = {
  post: null,
  photo: null,
  withImage: true
}

PostBuilder.proptypes = {
  post: PropTypes.object,
  withImage: PropTypes.bool,
  values: PropTypes.object.isRequired
}

export default PostBuilder
