import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess, signInFailure} from '../../redux/user/userSlice.js'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'


export default function DashProfile() {
  const { currentUser, error, loading, access_token } = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({})
  const filePickerRef = useRef()
  const dispatch = useDispatch()
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file){
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }
  useEffect(() => {
    dispatch(signInFailure("")) // Prevent previous messages
    if (imageFile){
      uploadImage()
    }
  }, [imageFile])

  const uploadImage = async () => {
    setImageFileUploading(true)
    setImageFileUploadError(null)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = 
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageFileUploadProgress(progress.toFixed(0))
        },
        (error) => {
          setImageFileUploadError("Resim yüklenemedi (Dosya 2MB'dan küçük olmalı)")
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL)
            setFormData({ ...formData, profilePicture: downloadURL })
            setImageFileUploading(false)
            setImageFileUploadProgress(false)
          })
        }
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('Değişiklik yapılmadı.');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Lütfen resim dosyasının yüklenmesini bekleyin');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'access_token' : access_token
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Kullanıcı profili başarıyla güncellendi");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers:{
          'access_token': access_token
        }
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profil</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
        <div 
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' 
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar 
              value={imageFileUploadProgress || 0} 
              text={`${imageFileUploadProgress}%`} 
              strokeWidth={5}  
              styles={{
                root:{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`
                },
              }}
            />
             
            )
          }
          <img 
            src={imageFileUrl || currentUser.profilePicture} 
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`} />
        </div>
        { imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
        <TextInput type='text' id='username' placeholder='kullanıcı adı' defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type='email' id='email' placeholder='birisi@gmail.com' defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type='password' id='password' placeholder='şifre' autoComplete="on" onChange={handleChange}/>
        <Button type='submit' gradientDuoTone='purpleToPink' outline disabled={loading || imageFileUploading}>
          {loading ? 'Yükleniyor...' : 'Güncelle'}
        </Button>
        {(currentUser.isAdmin || currentUser.isEditor) && (
          <Link to={'/gonderi-olustur'}>
            <Button type='button' gradientDuoTone='purpleToPink' className='w-full'>
              Gönderi oluştur
            </Button>
          </Link>
        )}
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Hesabı Sil</span>
        <span onClick={handleSignout} className='cursor-pointer'>Çıkış Yap</span>
      </div>
      {/* Error Messsages */}
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
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
              Hesabınızı silmek istediğinize emin misiniz?
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
