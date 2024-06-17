import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import { useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate } from 'react-router-dom'
import { useSelector} from 'react-redux'
import { AUTHOR_LIST } from '../utils/consts.js'

export default function CreatePost() {
  const { access_token } = useSelector(state => state.user)
  const [file, setFile] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [formData, setFormData] = useState({})
  const [publishError, setPublishError] = useState(null)
  const navigate = useNavigate()

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Lütfen bir resim dosyası seçin')
        return;
      }
      setImageUploadError(null)
      const storage = getStorage(app)
      const fileName = new Date().getTime() + '-' + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImageUploadProgress(progress.toFixed(0))
        },
        (error) => {
          setImageUploadError('Resim dosyası yüklenemedi')
          setImageUploadProgress(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null)
            setImageUploadError(null)
            setFormData({ ...formData, image: downloadURL })
          });
        }
      );
    } catch (error) {
      setImageUploadError('Resim dosyası yüklenemedi')
      setImageUploadProgress(null)
    }
  }

  const handleSubmit = async (e) => { 
    e.preventDefault()
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': access_token
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        setPublishError(null)
        navigate(`/post/${data.slug}`)
      } else
        setPublishError(data.message)
        

    } catch (error) {
      setPublishError(error.message)
    }
  }

  return (<div className='p-3 max-w-3xl mx-auto min-h-screen'>
    <h1 className='text-center text-3xl my-7 font-semibold'>Gönderi oluştur</h1>
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-4 sm:flex-row justify-between'>
        <TextInput
          type='text'
          placeholder='Başlık'
          required id='title'
          className='flex-1'
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Select onChange={(e) => setFormData({ ...formData, category: e.target.value})}>
          <option value='uncategorized'>Kategori seç</option>
          <option value='fizik'>Fizik</option>
          <option value='kimya'>Kimya</option>
          <option value='biyoloji'>Biyoloji</option>
        </Select>
      </div>
      <div className='flex flex-col gap-4 sm:flex-row justify-between'>
        <div className='flex flex-1 w-full justify-between border-4 rounded-lg'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}/>
          <Button 
            type='button' 
            gradientDuoTone='purpleToPink' 
            size='sm'
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}  
          >
          {imageUploadProgress ? (
            <div className='w-16 h-16'>
              <CircularProgressbar
                value={imageUploadProgress}
                text={`${imageUploadProgress || 0}%`}
              />
            </div>
          ) : ( 'Resim Yükle' )}
          </Button>
        </div>
        <Select onChange={(e) => setFormData({ ...formData, author: e.target.value })} className='min-w-36'>
          <option value='uncategorized'>Yazar seç</option>
          {
            AUTHOR_LIST.map((author) => {
              return author.category === formData.category ? (
                <option key={author.name} value={author.name}>{author.name}</option>
              ) : null
            })
          }
        </Select>
      </div>
      {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
      {formData.image && (
        <img
          src={formData.image}
          alt='upload'
          className='w-full h-72 object-cover'
        />
      )}
      <ReactQuill 
        theme='snow' 
        placeholder='Buraya yazın...' 
        className='h-72 mb-12' 
        required 
        onChange={(value) => setFormData({ ...formData, content: value })}  
      />
      <Button type='submit' gradientDuoTone='purpleToPink'>
        Yayınla
      </Button>
      {publishError && (
        <Alert className='mt-5' color='failure'>
          {publishError}
       </Alert>
        )}
    </form>
  </div>
  )
}
