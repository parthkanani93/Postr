import {
  db,
  collection,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  limit,
  serverTimestamp,
  doc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  orderBy,
  auth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
} from '../firebase/config'
import { v4 as uuid } from 'uuid'

export const ToggleInteraction = async (
  docId,
  interaction,
  hasInteracted,
  setInteraction,
  userId
) => {
  try {
    const postRef = doc(db, 'posts', docId)

    await updateDoc(postRef, {
      [interaction]: hasInteracted ? arrayRemove(userId) : arrayUnion(userId),
    })

    setInteraction((prev) => !prev)
  } catch (error) {
    console.log(error.message)
  }
}

export const getFollowedPosts = async (userObj) => {
  try {
    const postsRef = collection(db, 'posts')
    const q = query(
      postsRef,
      where('creatorId', 'in', userObj.following),
      orderBy('createdAt', 'desc'),
      limit(100)
    )

    /// if a user has many followed do these requests in batches of 10

    const querySnapshot = await getDocs(q)

    const timelinePosts = querySnapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }))

    return timelinePosts
  } catch (error) {
    console.log(error.message)
  }
}

export const getProfilePosts = async (userId) => {
  try {
    const postsRef = collection(db, 'posts')

    const postsQuery = query(
      postsRef,
      where('creatorId', '==', userId),
      limit(100)
    )
    const rePostsQuery = query(
      postsRef,
      where('rePosts', 'array-contains', userId),
      limit(50)
    )

    const query1Snapshot = await getDocs(postsQuery)
    const query2Snapshot = await getDocs(rePostsQuery)

    const profilePosts = query1Snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }))
    const profileRePosts = query2Snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }))

    const returnedPosts = [...profilePosts, ...profileRePosts].sort(
      (a, b) => a.createdAt - b.createdAt
    )

    return returnedPosts
  } catch (error) {
    console.log(error.message)
  }
}

export const getProfileLikedPosts = async (userId) => {
  try {
    const postsRef = collection(db, 'posts')

    const q = query(postsRef, where('likes', 'array-contains', userId))

    const querySnapshot = await getDocs(q)

    const likedPosts = querySnapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }))

    return likedPosts
  } catch (error) {
    console.log(error.message)
  }
}

export const createPost = async ({
  user,
  postValue,
  setPostValue,
  setLoading,
}) => {
  try {
    const newPostId = uuid()

    const postsRef = doc(db, 'posts', newPostId)

    await setDoc(postsRef, {
      id: newPostId,
      creatorId: user.id,
      creatorName: user.name,
      creatorUsername: user.username,
      creatorAvatar: user.avatarPhotoUrl,
      content: postValue.trim(),
      createdAt: serverTimestamp(),
      likes: [],
      rePosts: [],
    })

    setPostValue('')
  } catch (error) {
    setPostValue('')
    setLoading(false)
  }
}
