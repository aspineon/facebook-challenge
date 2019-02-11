import PropTypes from 'prop-types'
import { compose, setPropTypes } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { SIGNUP_FORM_NAME } from 'constants/formNames'
import styles from './SignupForm.styles'
import { withFormik } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  name: Yup.string('Ingrese un nombre')
    .required('Nombre es requerido')
    .matches(
      /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s ]+$/,
      'Nombre solo caracteres alfabéticos.'
    ),
  email: Yup.string('Ingrese un email')
    .email('Ingrese un email válido')
    .required('Email es requerido'),
  password: Yup.string('')
    .min(8, 'Contraseña debe contener al menos 8 caracteres')
    .required('Contraseña es requerida')
})

export default compose(
  // Set proptypes used in HOCs
  setPropTypes({
    signUpWithCredentials: PropTypes.func.isRequired // called by handleSubmit
  }),
  withFormik({
    mapPropsToValues: () => ({
      name: '',
      email: '',
      password: '',
      showPassword: false
    }),
    // Custom sync validation
    validationSchema: validationSchema,
    handleSubmit: ({ email, password, name }, { setSubmitting, props }) => {
      props.signUpWithCredentials({ email, password }, { displayName: name })
      setSubmitting(false)
    },
    displayName: SIGNUP_FORM_NAME
  }),
  // Add styles as props.classes
  withStyles(styles)
)
