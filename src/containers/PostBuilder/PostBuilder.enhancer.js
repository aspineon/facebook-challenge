import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import setDisplayName from 'recompose/setDisplayName'
import setPropTypes from 'recompose/setPropTypes'
import { withFirebase, withFirestore } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import { withNotifications } from 'modules/notification'
import { UserIsAuthenticated } from 'utils/router'
import styles from './PostBuilder.styles'
import { withFormik } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  message: Yup.string().required(),
  scope: Yup.mixed().oneOf(['FRIENDS', 'PUBLIC'])
})

const initialValues = { message: '', scope: 'FRIENDS' }

export default compose(
  setDisplayName('EnhancedPostBuilder'),
  UserIsAuthenticated,
  withNotifications,
  withFirebase,
  withFirestore,
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
        props: { post, firebase, firestore, showSuccess, showError, onClose }
      }
    ) => {
      const user = firebase.auth().currentUser

      try {
        if (post) {
          await firestore.update(
            { collection: 'posts', doc: post.id },
            {
              ...values,
              updateddAt: firestore.FieldValue.serverTimestamp()
            }
          )
          showSuccess('Post actualizado!')
          onClose()
          return
        } else {
          await firestore.add(
            { collection: 'posts' },
            {
              ...values,
              createdBy: user.uid,
              createdAt: firestore.FieldValue.serverTimestamp()
            }
          )
          showSuccess('Post creado!')
        }
      } catch (error) {
        console.error('Error', error.message || error) // eslint-disable-line no-console
        showError('Error guardando post:', error.message || error)
      }

      resetForm(initialValues)
      setSubmitting(false)
    },
    validateOnChange: false,
    displayName: 'POST_FORM'
  }),
  withStyles(styles, { withTheme: true })
)
