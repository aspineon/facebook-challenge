export default theme => ({
  form: {
    ...theme.flexColumnCenter,
    width: '80vw',
    minWidth: '300px',
    maxWidth: '500px',
    minHeight: '50px',
    padding: '0.5rem'
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '& textarea::before': {
      border: 'none'
    }
  },
  fieldsInverted: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  scopeInput: {
    marginRight: '0.5rem'
  },
  filterAndAction: {
    marginTop: '1rem',
    alignSelf: 'flex-end'
  }
})
