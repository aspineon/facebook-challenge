import React from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'

const PostBuilder = ({
  post,
  name = 'Raul',
  values,
  isValid,
  touched,
  errors,
  isSubmitting,
  handleChange,
  handleBlur,
  handleSubmit,
  onClose,
  classes
}) => (
  <form onSubmit={handleSubmit} className={classes.form}>
    <TextField
      id="message"
      name="message"
      placeholder={`¿Qué estás pensando, ${name}?`}
      value={values.message}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.message && Boolean(errors.message)}
      fullWidth
      multiline
      rows={5}
      className={classes.messageInput}
    />
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
