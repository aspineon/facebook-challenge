import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import setDisplayName from 'recompose/setDisplayName'
import setPropTypes from 'recompose/setPropTypes'
import { withFirebase, withFirestore } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import { withNotifications } from 'modules/notification'
import styles from './PostBuilder.styles'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import { connect } from 'react-redux'
import {
  addPostFireStore,
  updatePostFireStore
} from 'containers/TimeLine/actions'

const validationSchema = Yup.object({
  message: Yup.string().required(),
  scope: Yup.mixed().oneOf(['FRIENDS', 'PUBLIC'])
})

const initialValues = { message: '', scope: 'FRIENDS' }

export default compose(
  setDisplayName('EnhancedPostBuilder'),
  withNotifications,
  withFirebase,
  withFirestore,
  connect(
    ({ imageCropper }) => ({
      photo: imageCropper[0]
    }),
    { addPostFireStore, updatePostFireStore }
  ),
  setPropTypes({
    showError: PropTypes.func.isRequired,
    showSuccess: PropTypes.func.isRequired,
    firebase: PropTypes.shape({
      auth: PropTypes.func.isRequired
    }),
    firestore: PropTypes.shape({
      add: PropTypes.func.isRequired
    })
  }),
  withFormik({
    mapPropsToValues: ({ post }) => ({
      message: (post && post.message) || initialValues.message,
      scope: (post && post.scope) || initialValues.scope
    }),
    validationSchema,
    handleSubmit: async (
      values,
      {
        setSubmitting,
        resetForm,
        props: {
          post,
          photo,
          addPostFireStore,
          updatePostFireStore,
          showSuccess,
          showError,
          onClose
        }
      }
    ) => {
      try {
        if (post) {
          await updatePostFireStore(post.id, values)
          showSuccess('Post actualizado!')
          onClose()
          return
        } else {
          await addPostFireStore(values, photo)
          showSuccess('Post creado!')
          resetForm(initialValues)
        }
      } catch (error) {
        console.error('Error', error.message || error) // eslint-disable-line no-console
        showError('Error guardando post:', error.message || error)
      }

      setSubmitting(false)
    },
    validateOnChange: false,
    displayName: 'POST_FORM'
  }),
  withStyles(styles, { withTheme: true })
)
