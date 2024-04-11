import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Modal, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashPosts() {
  const { currentUser, access_token } = useSelector((state) => state.user)
  const [ userPosts, setUserPosts ] = useState(null)
  const [ showMore, setShowMore ] = useState(true)
  const [ showModal, setShowModal ] = useState(false)
  const [ postIdToDelete, setPostIdToDelete ] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if (res.ok){
          console.log(data.posts[0]);
          setUserPosts(data.posts)
          console.log(userPosts);
          if (data.posts.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    if (currentUser.isAdmin || currentUser.isEditor) {
      fetchPosts()
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = userPosts.length
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json()
      if (res.ok){
        setUserPosts((prev) => [...prev, ...data.posts])
        if (data.posts.length < 9) {
          setShowMore(false)
        }
      }
    
    } catch (error){
      console.log(error.message);
    }
  }

  const handleDeletePost = async () => {
    setShowModal(false)
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,{
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
        setUserPosts((prev) => 
          prev.filter((post) => post._id !== postIdToDelete))
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
        <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>Yükleme tarihi</Table.HeadCell>
            <Table.HeadCell>Resim</Table.HeadCell>
            <Table.HeadCell>Başlık</Table.HeadCell>
            <Table.HeadCell>Kategori</Table.HeadCell>
            <Table.HeadCell>Sil</Table.HeadCell>
            <Table.HeadCell>Düzenle</Table.HeadCell>
          </Table.Head>

          {userPosts.map((post) => (
            /** Post Mapping */
            <Table.Body className='divide-y' key={post._id}>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${post.slug}`} >
                    <img
                      src={post.image}
                      alt={post.title}
                      className='w-20 h-10 object-cover bg-gray-500'
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link className='font-medium text-gray-900 dark:text-white line-clamp-3' to={`/post/${post.slug}`}>
                    {post.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {post.category}
                </Table.Cell>
                <Table.Cell>
                  <span 
                    onClick={() => {
                      setShowModal(true)
                      setPostIdToDelete(post._id)
                    }} 
                    className='font-medium text-red-500 hover:underline cursor-pointer'>
                    Sil
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Link className='text-teal-500' to={`/gonderi-duzenle/${post._id}`}>
                    <span>Düzenle</span>
                  </Link>
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
        <p>Henüz bir gönderi yok.</p>
      )}
      {/** Modal */}
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
              Gönderiyi silmek istediğinize emin misiniz?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>
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
