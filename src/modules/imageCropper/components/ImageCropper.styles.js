export default theme => ({
  root: {
    display: 'flex',
    width: '100%'
  },
  cropperContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropzone: {
    width: '100%',
    textAlign: 'center',
    border: 'dashed #b8b5b5',
    borderRadius: '4px',
    padding: '10px',
    cursor: 'pointer'
  },
  photosContainer: {
    display: 'flex'
  },
  photoItem: {
    position: 'relative',
    maxHeight: '200px',
    background: '#000',
    '&:hover img': {
      opacity: '.5'
    }
  },
  photo: {
    objectFit: 'cover',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    opacity: 1,
    '-webkit-transition': '.3s ease-in-out',
    transition: '.3s ease-in-out'
  },
  cropFabButton: {
    position: 'absolute',
    bottom: '0.5rem',
    left: '0.5rem'
  },
  deleteFabButton: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem'
  },
  cropperDialog: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullPhotoDialog: {
    margin: 0,
    width: 'auto',
    height: 'auto',
    maxHeight: '80vh'
  }
})
