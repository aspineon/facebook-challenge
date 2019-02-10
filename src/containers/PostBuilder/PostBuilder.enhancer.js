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
import { connect } from 'react-redux'
import cuid from 'cuid'
import { deleteImage } from 'modules/imageCropper/actions'

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
  connect(
    ({ imageCropper }) => ({
      photos: imageCropper
    }),
    { deleteImage }
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
          firebase,
          firestore,
          photos,
          deleteImage,
          showSuccess,
          showError,
          onClose
        }
      }
    ) => {
      const user = firebase.auth().currentUser

      if (!user || !user.uid) {
        console.log('Debes ingresar a tu cuenta antes de crear una oferta') // eslint-disable-line no-console

        return
      }

      let imageUrl
      let data = values

      if (photos.length > 0) {
        const photoName = cuid()
        const path = `${user.uid}/postImages`

        try {
          const uploadedFile = await firebase.uploadFile(
            path,
            photos[0].croppedBlob,
            null,
            {
              name: photoName
            }
          )

          imageUrl = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL()
          data = {
            ...data,
            image: { url: imageUrl, path: path + '/' + photoName }
          }
        } catch (error) {
          showError('Error al subir imagen:', error.message || error)
          console.error('Error', error.message || error) // eslint-disable-line no-console
          throw error
        }
      }

      try {
        data = { ...data, updatedAt: firestore.FieldValue.serverTimestamp() }

        if (post) {
          await firestore.update({ collection: 'posts', doc: post.id }, data)
          showSuccess('Post actualizado!')
          onClose()
          return
        } else {
          data = {
            ...data,
            createdBy: user.uid,
            createdAt: firestore.FieldValue.serverTimestamp()
          }
          await firestore.add({ collection: 'posts' }, data)
          showSuccess('Post creado!')
          resetForm(initialValues)
        }

        if (imageUrl) {
          deleteImage()
        }
      } catch (error) {
        showError('Error guardando post:', error.message || error)
        console.error('Error', error.message || error) // eslint-disable-line no-console
      }

      setSubmitting(false)
    },
    validateOnChange: false,
    displayName: 'POST_FORM'
  }),
  withStyles(styles, { withTheme: true })
)
