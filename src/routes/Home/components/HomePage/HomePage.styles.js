export default theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  section: {
    ...theme.flexRowCenter
  },
  title: {
    marginBottom: '3rem'
  },
  actionButtons: {
    width: '80vw',
    minWidth: '300px',
    maxWidth: '500px',
    marginBottom: '1.5rem'
  }
})
