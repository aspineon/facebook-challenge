export default theme => ({
  cropperContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '50px'
  },
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    minWidth: '250px',
    border: 'dashed #b8b5b5',
    borderRadius: '4px',
    padding: '10px',
    textAlign: 'center'
  },
  cloudUploadIcon: {
    fontSize: '75px'
  },
  photosContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  photoItem: {
    textAlign: 'center',
    margin: '1rem'
  },
  photo: {
    maxHeight: '200px',
    maxWidth: '250px',
    cursor: 'pointer',
    objectFit: 'contain',
    borderRadius: '0.5rem'
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
