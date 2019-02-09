import React from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { ImageCropper } from 'modules/imageCropper'

const PostBuilder = ({
  post,
  values,
  isValid,
  touched,
  errors,
  isSubmitting,
  handleChange,
  handleBlur,
  handleSubmit,
  onClose,
  photos,
  classes
}) => (
  <form onSubmit={handleSubmit} className={classes.form}>
    <div
      className={photos.length > 0 ? classes.fieldsInverted : classes.fields}>
      <TextField
        id="message"
        name="message"
        placeholder={
          photos.length > 0 ? 'Añade un comentario' : '¿Qué estás pensando ?'
        }
        value={values.message}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.message && Boolean(errors.message)}
        multiline
        rowsMax={100}
        InputProps={{ disableUnderline: true }}
      />
      <ImageCropper max={1} />
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
      <Button
        color="primary"
        type="submit"
        variant="contained"
        disabled={!isValid || isSubmitting}>
        {post && post.id
          ? isSubmitting
            ? '...Guardando'
            : 'Guardar'
          : isSubmitting
          ? '...Compartiendo'
          : 'Compartir'}
      </Button>
      {post && (
        <Button onClick={onClose} variant="contained">
          Cancelar
        </Button>
      )}
    </div>
  </form>
)
export default PostBuilder
