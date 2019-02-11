export default theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  section: {
    ...theme.flexRowCenter
  },
  title: {
    marginBottom: '1.75rem'
  }
})
