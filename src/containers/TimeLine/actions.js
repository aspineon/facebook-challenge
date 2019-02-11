import { LOAD_POSTS, ADD_POST, UPDATE_POST, DELETE_POST } from './actionTypes'
import { deleteImage } from 'modules/imageCropper/actions'
import cuid from 'cuid'
import queryConfig from './config'

export const loadPost = data => ({
  type: LOAD_POSTS,
  data
})

export const addPost = newInstance => ({
  type: ADD_POST,
  newInstance
})

export const updatePost = (id, updates) => ({
  type: UPDATE_POST,
  id,
  updates
})

export const deletePost = (id = 0) => ({
  type: DELETE_POST,
  id
})

export const getPostsFirestore = (
  queryParams = { lastPostId: null, where: null }
) => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore()

  try {
    let options = queryConfig

    if (queryParams.where) {
      options = { ...options, where: queryParams.where }
    }

    if (queryParams.lastPostId) {
      const startAfter = await firestore
        .collection(queryConfig.collection)
        .doc(queryParams.lastPostId)
        .get()

      options = { ...options, startAfter }
    }

    const querySnap = await firestore.get(options)

    if (querySnap.docs.length === 0) {
      return querySnap
    }

    let newPosts = []

    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id }
      newPosts.push(evt)
    }

    const data = queryParams.lastPostId
      ? [...getState().posts, ...newPosts]
      : newPosts

    dispatch(loadPost(data))
    return querySnap
  } catch (error) {
    throw error
  }
}

export const addPostFireStore = (newInstance = null, image = null) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase()
  const firestore = getFirestore()
  const user = firebase.auth().currentUser

  if (!user || !user.uid || !newInstance) {
    throw new Error('Debes ingresar a tu cuenta antes de crear una oferta')
  }

  let data = newInstance
  let imageUrl

  if (image) {
    const photoName = cuid()
    const path = `${user.uid}/postImages`

    try {
      const uploadedFile = await firebase.uploadFile(
        path,
        image.croppedBlob,
        null,
        {
          name: photoName
        }
      )

      imageUrl = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL()
      data = {
        ...data,
        image: { url: imageUrl, path: path + '/' + photoName }
      }
    } catch (error) {
      throw error
    }
  }

  try {
    const userProfile = getState().firebase.profile

    data = {
      ...data,
      publisher: {
        displayName: userProfile.displayName || '',
        avatarUrl: userProfile.avatarUrl || ''
      },
      createdBy: user.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp()
    }

    const newPost = await firestore.add(
      { collection: queryConfig.collection },
      data
    )

    if (imageUrl) {
      dispatch(deleteImage())
    }

    dispatch(
      addPost({
        id: newPost.id,
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
    )
  } catch (error) {
    console.error('Error', error.message || error) // eslint-disable-line no-console
  }
}

export const updatePostFireStore = (id, updates) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  if (!id) {
    throw new Error('Post Id not supply')
  }

  const firestore = getFirestore()

  try {
    const data = {
      ...updates,
      updatedAt: firestore.FieldValue.serverTimestamp()
    }

    await firestore.update(
      { collection: queryConfig.collection, doc: id },
      data
    )

    dispatch(updatePost(id, { ...data, updatedAt: Date.now() }))
  } catch (error) {
    throw error
  }
}

export const deletePostFireStore = id => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  if (!id) {
    throw new Error('Post Id not supply')
  }

  const firestore = getFirestore()

  try {
    try {
      await firestore.delete({ collection: queryConfig.collection, doc: id })
    } catch (error) {
      throw error
    }

    dispatch(deletePost(id))
  } catch (error) {
    console.error('Error', error.message || error) // eslint-disable-line no-console
  }
}
