import {
  db,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  doc,
  increment,
} from '../firebase/config'
import { getUserByUserId } from './firebase'
import { v4 as uuid } from 'uuid'

export const getPostComments = async (postId) => {
  try {
    const users = []

    const commentsRef = collection(db, 'posts', postId, 'comments')
    const querySnapshot = await getDocs(commentsRef)

    const commentsWithOutUserInfo = querySnapshot.docs.map((doc) => doc.data())

    for (let comment of commentsWithOutUserInfo) {
      const answer = users.some((user) => user.id === comment.creatorId)

      if (!answer) {
        const user = await getUserByUserId(comment.creatorId)
        users.push(user)
      }
    }

    const comments = commentsWithOutUserInfo.map((comment) => {
      const [commentUser] = users.filter(
        (user) => user.id === comment.creatorId
      )

      return { ...comment, user: commentUser }
    })

    return comments
  } catch (error) {
    console.error(error.message)
  }
}

export const createComment = async (
  postId,
  creator,
  content,
  setComments,
  setPost
) => {
  try {
    const commentId = uuid()
    const commentsRef = doc(db, 'posts', postId, 'comments', commentId)
    const postRef = doc(db, 'posts', postId)

    await setDoc(commentsRef, {
      creatorId: creator.id,
      id: commentId,
      content,
      createdAt: serverTimestamp(),
    })

    await updateDoc(postRef, { commentsNumber: increment(1) })

    setComments((prev) => [
      {
        creatorId: creator.id,
        content,
        createdAt: new Date(),
        id: commentId,
        user: creator,
      },
      ...prev,
    ])

    setPost((prev) => ({ ...prev, commentsNumber: prev.commentsNumber + 1 }))
  } catch (error) {
    console.error(error.message)
  }
}

export const deleteComment = async (postId, commentId, setComments) => {
  try {
    const commentRef = doc(db, 'posts', postId, 'comments', commentId)
    const postRef = doc(db, 'posts', postId)

    await deleteDoc(commentRef)

    await updateDoc(postRef, { commentsNumber: increment(-1) })

    setComments((prev) => prev.filter((comment) => comment.id !== commentId))
  } catch (error) {
    console.error(error.message)
  }
}
