import React from 'react'
import PropTypes from 'prop-types'
import ClearIcon from '@material-ui/icons/Clear'
import CropIcon from '@material-ui/icons/Crop'
import DoneIcon from '@material-ui/icons/Done'
import Dialog from '@material-ui/core/Dialog'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import Dropzone from 'react-dropzone'
import Cropper from 'react-image-crop'
import Typography from '@material-ui/core/Typography'
import Fab from '@material-ui/core/Fab'
import 'react-image-crop/dist/ReactCrop.css'

const ImageCropper = ({
  photos,
  max,
  crop,
  originalDataUrl,
  selectedPhotoIndex,
  editingPhoto,
  cropperDialogOpen,
  disabledCropperButton,
  fullPhotoDialogOpen,
  onDrop,
  onImageLoaded,
  onCropChange,
  cropPhoto,
  showFullPhoto,
  editPhoto,
  deletePhoto,
  closeCropperDialog,
  closeFullPhotoDialog,
  classes
}) => (
  <div className={classes.root}>
    {photos.length < max && (
      <div className={classes.cropperContainer}>
        <Dropzone
          onDrop={onDrop}
          multiple={false}
          accept="image/jpeg, image/png"
          maxSize={4194304}>
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div {...getRootProps()} className={classes.dropzone}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <Typography variant="caption">
                    Intenta arrastrar algunas fotos aquí, o haz clic para
                    seleccionarlas.
                  </Typography>
                ) : (
                  <Typography variant="caption">
                    Arrastra una imagen para publicar (Solo png/jpg)
                  </Typography>
                )}
              </div>
            )
          }}
        </Dropzone>
      </div>
    )}
    {photos.length > 0 && (
      <div className={classes.photosContainer}>
        {photos.map((photo, index) => (
          <div className={classes.photoItem} key={`cropped-photos-${index}`}>
            <CardMedia
              component="img"
              className={classes.photo}
              image={photo.croppedUrl}
              onClick={() => showFullPhoto(index)}
              title="Preview"
            />
            <Fab
              size="small"
              className={classes.cropFabButton}
              onClick={() => editPhoto(index)}>
              <CropIcon />
            </Fab>
            <Fab
              size="small"
              onClick={() => deletePhoto(index)}
              className={classes.deleteFabButton}>
              <ClearIcon />
            </Fab>
          </div>
        ))}
      </div>
    )}

    {/* Full Image Dialog starts */}
    {photos.length > 0 && (
      <Dialog
        maxWidth="xl"
        onClose={closeFullPhotoDialog}
        open={fullPhotoDialogOpen}
        aria-labelledby="simple-dialog-title">
        {Boolean(photos[selectedPhotoIndex]) && (
          <CardMedia
            component="img"
            className={classes.fullPhotoDialog}
            src={photos[selectedPhotoIndex].croppedUrl}
          />
        )}
      </Dialog>
    )}
    {/* Full image Dialog ends */}

    {/* Cropper Dialog starts */}
    <Dialog
      maxWidth="xl"
      onClose={closeCropperDialog}
      open={cropperDialogOpen}
      aria-labelledby="simple-dialog-title">
      {cropperDialogOpen && (
        <div className={classes.cropperDialog}>
          <Cropper
            className={classes.fullPhotoCard}
            src={
              (editingPhoto && photos[selectedPhotoIndex].originalDataUrl) ||
              originalDataUrl
            }
            crop={crop}
            keepSelection={true}
            onImageLoaded={onImageLoaded}
            onChange={onCropChange}
          />
          <IconButton
            variant="contained"
            color="primary"
            onClick={cropPhoto}
            title="Ok"
            disabled={disabledCropperButton}>
            <DoneIcon />
          </IconButton>
        </div>
      )}
    </Dialog>
    {/* Cropper Dialog ends */}
  </div>
)

ImageCropper.defaultProps = {
  max: 5,
  photos: [],
  originalPhotoSources: [],
  selectedPhotoIndex: 0,
  disabledCropperButton: true
}

ImageCropper.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      originalDataUrl: PropTypes.string,
      croppedUrl: PropTypes.string,
      croppedBlob: PropTypes.object
    })
  ).isRequired,
  max: PropTypes.number,
  crop: PropTypes.object.isRequired,
  selectedPhotoIndex: PropTypes.number.isRequired,
  editingPhoto: PropTypes.bool.isRequired,
  disabledCropperButton: PropTypes.bool.isRequired,
  fullPhotoDialogOpen: PropTypes.bool.isRequired,
  cropperDialogOpen: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  onImageLoaded: PropTypes.func.isRequired,
  onCropChange: PropTypes.func.isRequired,
  cropPhoto: PropTypes.func.isRequired,
  showFullPhoto: PropTypes.func.isRequired,
  editPhoto: PropTypes.func.isRequired,
  closeCropperDialog: PropTypes.func.isRequired,
  closeFullPhotoDialog: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default ImageCropper
