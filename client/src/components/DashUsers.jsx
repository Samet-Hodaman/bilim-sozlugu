import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, Table } from 'flowbite-react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { signoutSuccess } from '../redux/user/userSlice'

export default function DashUsers() {
  const { currentUser, access_token } = useSelector((state) => state.user)
  const [ users, setUsers ] = useState([])
  const [ showMore, setShowMore ] = useState(true)
  const [ showModal, setShowModal ] = useState(false)
  const [ userIdToDelete, setUserIdToDelete ] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'access_token' : access_token
          },
        })
        const data = await res.json()
        if (res.ok){
          setUsers(data.users)
          if (data.users.length < 9) {
            setShowMore(false)
          }
        } else {
          if (data.message === 'TokenExpiredError') {
            dispatch(signoutSuccess())
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    if (currentUser.isAdmin) {
      fetchUsers()
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = users.length
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access_token': access_token
        }
      })
      const data = await res.json()
      if (res.ok){
        setUsers((prev) => [...prev, ...data.users])
        if (data.users.length < 9) {
          setShowMore(false)
        }
      }
    
    } catch (error){
      console.log(error.message);
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      console.log(userIdToDelete);
      const res = await fetch(`/api/user/delete/${userIdToDelete}`,{
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
        setUsers((prev) => 
          prev.filter((post) => post._id !== userIdToDelete))
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='table-auto md:mx-auto p-3 overflow-x-scroll scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
        <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>Kayıt tarihi</Table.HeadCell>
            <Table.HeadCell>Fotoğraf</Table.HeadCell>
            <Table.HeadCell>Kullanıcı adı</Table.HeadCell>
            <Table.HeadCell>E-posta</Table.HeadCell>
            <Table.HeadCell>Admin</Table.HeadCell>
            <Table.HeadCell>Sil</Table.HeadCell>
          </Table.Head>
          {users.map((user) => (
            <Table.Body className='divide-y' key={user._id}>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                    />
                </Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.isAdmin ? (<FaCheck className='text-green-500' />) : (<FaTimes className='text-red-500' />)}</Table.Cell>
                <Table.Cell>
                { !user.isAdmin && 
                  <span 
                    onClick={() => {
                      setShowModal(true)
                      setUserIdToDelete(user._id)
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
        <p>Henüz bir kullanıcı yok.</p>
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
              Kullanıcıyı silmek istediğinize emin misiniz?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
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
