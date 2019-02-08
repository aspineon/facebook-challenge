export default theme => ({
  form: {
    ...theme.flexColumnCenter,
    width: '80vw',
    minWidth: '300px',
    maxWidth: '500px',
    minHeight: '50px',
    padding: '0.5rem'
  },
  messageInput: {
    marginBottom: '0.8rem'
  },
  scopeInput: {
    marginRight: '0.5rem'
  },
  filterAndAction: {
    alignSelf: 'flex-end'
  }
})
