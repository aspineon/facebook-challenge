export default theme => ({
  root: {
    ...theme.flexColumnCenter,
    width: '80vw',
    minWidth: '300px',
    maxWidth: '500px',
    minHeight: '80px',
    maxHeight: '300px',
    border: ' solid 1px #d6d5d6',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    backgroundColor: 'white',
    padding: '1rem',
    paddingBottom: '0.5rem',
    alignItems: 'flex-start'
  },
  message: {
    width: '100%',
    paddingBottom: '0.5rem',
    borderBottom: 'solid 1px #d6d5d6',
    marginBottom: '0.5rem'
  }
})
