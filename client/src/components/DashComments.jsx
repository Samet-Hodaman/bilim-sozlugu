import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Modal, Table } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

export default function DashComments() {
  const { currentUser, access_token } = useSelector((state) => state.user)
  const [ comments, setComments ] = useState([])
  const [ showMore, setShowMore ] = useState(true)
  const [ showModal, setShowModal ] = useState(false)
  const [ commentIdToDelete, setCommentIdToDelete ] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments?userId=${currentUser._id}&sort=desc`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'access_token' : access_token
          },
        })
        const data = await res.json()
        if (res.ok){
          setComments(data.comments)
          if (data.comments.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    if (currentUser) {
      fetchComments()
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = comments.length
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access_token': access_token
        }
      })
      const data = await res.json()
      if (res.ok){
        setComments((prev) => [...prev, ...data.comments])
        if (data.comments.length < 9) {
          setShowMore(false)
        }
      }
    
    } catch (error){
      console.log(error.message);
    }
  }

  const handleDeleteComment = async () => {
    setShowModal(false)
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'access_token' : access_token
        },
      })
      const data = await res.json()
      if (!res.ok){
        console.log(data.message)
      } else {
        setComments((prev) => 
          prev.filter((post) => post._id !== commentIdToDelete))
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleGoComment = async (comment) => {
    const res = await fetch(`/api/post/getposts?postId=${comment.postId}`)
    const data = await res.json()
    if (res.ok) {
      navigate(`/post/${data.posts[0].slug}/comment/${comment._id}`)
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser && comments.length > 0 ? (
        <>
        <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>Paylaşma tarihi</Table.HeadCell>
            <Table.HeadCell>Yorum içeriği</Table.HeadCell>
            <Table.HeadCell>Beğeni sayısı</Table.HeadCell>
            <Table.HeadCell>Gönderi id</Table.HeadCell>
            <Table.HeadCell>Kullanıcı id</Table.HeadCell>
            <Table.HeadCell>Sil</Table.HeadCell>
          </Table.Head>
          {comments.map((comment) => (
            <Table.Body className='divide-y' key={comment._id}>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>
                  {new Date(comment.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell onClick={() => handleGoComment(comment)} className='cursor-pointer line-clamp-2'>
                  {comment.content}
                </Table.Cell>
                <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                <Table.Cell>{comment.postId}</Table.Cell>
                <Table.Cell>{comment.userId}</Table.Cell>
                <Table.Cell>
                { !comment.isAdmin && 
                  <span 
                    onClick={() => {
                      setShowModal(true)
                      setCommentIdToDelete(comment._id)
                    }} 
                    className='font-medium text-red-500 hover:underline cursor-pointer'>
                      Sil
                  </span>
                }
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        { 
          showMore && (
            <button 
              onClickCapture={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
              Daha fazla...
            </button>
          )
        }
        </>
      ) : (
        <p>Henüz bir yorum yok.</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Bu yorumu silmek istediğinize emin misiniz?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>
                Evet, eminim.
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                Hayır, iptal et.
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
