import { Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function DashMail() {
  const { currentUser, access_token } = useSelector(state => state.user)
  const [ mails, setMails ] = useState([])
  const [ showMore, setShowMore ] = useState(true)

  const [ formData, setFormData ] = useState({
    userId: currentUser._id,
    content: "Ilk not denemesi"
  })

  useEffect(() => {
    const getMails = async () => {
      try {
        const res = await fetch('/api/mail/getmails',{
          method: "GET",
          headers: {
            'Content-Type':'application/json',
            'access_token': access_token
          }
        })
        if (res.ok) {
          const data = await res.json()
          setMails(data.mails)
          if (data.mails.length < 9)
            setShowMore(false)
        }
      } catch(error) {
        console.log(error.message);
      }
    }

    getMails()
  }, [])

  const handleCreateMail = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/mail/create',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': access_token
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        console.log(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleShowMore = async () => {
    const startIndex = mails.length
    try {
      const res = await fetch(`/api/mail/getmails?startIndex=${startIndex}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access_token': access_token
        }
      })
      const data = await res.json()
      if (res.ok){
        setComments((prev) => [...prev, ...data.mails])
        if (data.mails.length < 9) {
          setShowMore(false)
        }
      }
    
    } catch (error){
      console.log(error.message);
    }
  }

  return (
    <div className='mx-auto'>
    {(currentUser.isAdmin && mails && mails.length > 0) ? (
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

          {mails.map((mail) => (
            /** Post Mapping */
            <Table.Body className='divide-y' key={mail._id}>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>
                  {new Date(mail.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${mail.slug}`} >
                    <img
                      src={mail.image}
                      alt={mail.title}
                      className='w-20 h-10 object-cover bg-gray-500'
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link className='font-medium text-gray-900 dark:text-white line-clamp-3' to={`/post/${mail.slug}`}>
                    {mail.content}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {mail.userId}
                </Table.Cell>
                <Table.Cell>
                  <span 
                    onClick={() => {
                      setShowModal(true)
                      setPostIdToDelete(mail._id)
                    }} 
                    className='font-medium text-red-500 hover:underline cursor-pointer'>
                    Sil
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Link className='text-teal-500' to={`/gonderi-duzenle/${mail._id}`}>
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
      ) : (<>
        <p>Henüz bir not yok.</p>
        <button onClick={handleCreateMail}>Click</button>
      </>
      )}
    </div>
  )
}
