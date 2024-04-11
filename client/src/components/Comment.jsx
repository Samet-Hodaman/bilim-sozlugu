import { useEffect, useState } from "react"
import moment from 'moment'
import 'moment/locale/tr'
import { FaThumbsUp } from "react-icons/fa"
import { useSelector } from 'react-redux'
import { Button, Textarea } from 'flowbite-react'

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const { currentUser, access_token } = useSelector(state => state.user)
  const [ user, setUser] = useState({})
  const [ isEditing, setIsEditing ] = useState(false)
  const [ editedContent, setEditedContent ] = useState(comment.content)

  moment.locale('tr')
  useEffect(() => {
    // const targetElement = document.getElementById(comment._id)
    // targetElement.scrollIntoView()
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`)
        const data = await res.json()
        if (res.ok) {
          setUser(data)
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    getUser()
  }, [comment])
  
  const handleEdit = async () => {
    setIsEditing(true)
    setEditedContent(comment.content)
  }

  const handleSave = async () => {
    try {
      if (comment.content === editedContent){
        alert("No changes made")
        return
      }
      const res = await fetch(`/api/comment/editComment/${comment._id}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'access_token' : access_token
        },
        body: JSON.stringify({
          content: editedContent
        })
      })
      if (res.ok) {
        setIsEditing(false)
        onEdit(comment, editedContent)
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm" id={comment._id}>
      <div className="flex-shrink-0 mr-3">
        <img 
          className="w-10 h-10 rounded-full bg-gray-200" 
          src={user.profilePicture} 
          alt={user.username}   
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">{user ? `@${user.username}` : 'Anonim kullanıcı'}</span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {/* Editing part */}
        {isEditing ? (
          <>
          <Textarea
            className="mb-2"
            value={editedContent}   
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="flex justify-end gap-2 text-xs">
            <Button 
              type="button" 
              size='sm' 
              gradientDuoTone='purpleToBlue'
              onClick={handleSave}
            >
              Kaydet
            </Button>
            <Button 
              type="button" 
              size='sm' 
              gradientDuoTone='purpleToBlue'
              outline
              onClick={() => setIsEditing(false)}
            >
              İptal
            </Button>
          </div>
          {/***************/}
          </>
        ) : (
          <>
          {/* Comment part  */}
          <p className="text-gray-500 pb-2">
            {comment.content}
            {comment.isChanged && (
              <span className="text-xs pl-1 text-gray-400 dark:text-white">
                (Düzenlendi)
              </span>
            )}
          </p>
          <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
            <button 
              type="button" 
              onClick={() => onLike(comment._id)} 
              className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}
            >
              <FaThumbsUp className="text-sm"/>
            </button>
            {/* Likes number*/}
            <p className="text-gray-400">
              {
                comment.numberOfLikes > 0 && comment.numberOfLikes + " kişi beğendi."
              }
            </p>

            {/* Edit button */}
            {
              currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
              <>
                <button 
                  type="button" 
                  onClick={handleEdit} 
                  className="text-gray-400 hover:text-blue-500"
                >
                  Düzenle
                </button>
                <button 
                  type="button" 
                  onClick={() => onDelete(comment._id)} 
                  className="text-gray-400 hover:text-red-500"
                >
                  Sil
                </button>
              </>
              )
            }
          </div>
          </>
        )}
        
      </div>
    </div>
  )
}
