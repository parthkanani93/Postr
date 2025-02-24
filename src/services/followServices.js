import {
  db,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  query,
  where,
} from '../firebase/config'

export const followUser = async (followerId, followedId, setIsFollowing) => {
  try {
    const followerRef = doc(db, 'users', followerId)
    const followedRef = doc(db, 'users', followedId)

    await Promise.all([
      updateDoc(followerRef, { following: arrayUnion(followedId) }),
      updateDoc(followedRef, { followers: arrayUnion(followerId) }),
    ])

    setIsFollowing(true)
  } catch (error) {
    console.error(error.message)
  }
}

export const unFollowUser = async (followerId, followedId, setIsFollowing) => {
  try {
    const followerRef = doc(db, 'users', followerId)
    const followedRef = doc(db, 'users', followedId)

    await Promise.all([
      updateDoc(followerRef, { following: arrayRemove(followedId) }),
      updateDoc(followedRef, { followers: arrayRemove(followerId) }),
    ])

    setIsFollowing(false)
  } catch (error) {
    console.error(error.message)
  }
}

export const getProfileFollowers = async (followers) => {
  try {
    const usersRef = collection(db, 'users')

    const q = query(usersRef, where('id', 'in', followers))

    const querySnapshot = await getDocs(q)

    const followersResponse = querySnapshot.docs.map((doc) => doc.data())

    return followersResponse
  } catch (error) {
    console.error(error.message)
  }
}

export const getProfileFollowing = async (following) => {
  try {
    const usersRef = collection(db, 'users')

    const q = query(usersRef, where('id', 'in', following))

    const querySnapshot = await getDocs(q)

    const followingResponse = querySnapshot.docs.map((doc) => doc.data())

    return followingResponse
  } catch (error) {
    console.error(error.message)
  }
}
