import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

/**
 * Function to delete post image from FireStorage. Triggered when posts are removed within the
 * posts collection.
 * @type {functions.CloudFunction}
 */
export default functions.firestore
  .document('posts/{postId}')
  .onDelete(deleteImageFromFirestorage)

/**
 *
 * @param  {admin.DataSnapshot} snap - Database event from function being
 * @param  {functions.EventContext} context - Function context which includes
 * data about the event. More info in docs:
 * https://firebase.google.com/docs/reference/functions/functions.EventContext
 * @return {Promise} Resolves with user's profile
 */
function deleteImageFromFirestorage(snap, context) {
  const data = snap.data()

  console.log('Post deleted: ', data)

  if (!data.image || !data.image.path) {
    console.log('This post deleted does not have any image')
    return
  }

  const bucket = admin.storage().bucket()
  const file = bucket.file(data.image.path)
  return file.delete()
}
