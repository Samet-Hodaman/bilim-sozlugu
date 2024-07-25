import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import OAuth from '../components/OAuth'
import { useDispatch } from 'react-redux'
import { signInSuccess, setToken} from '../redux/user/userSlice'

export default function SignIn() {
  const logoURL = "https://firebasestorage.googleapis.com/v0/b/bilim-sozlugu.appspot.com/o/Ana_Logo.png?alt=media&token=75e3a1b4-c5d6-4cb9-927f-9008120e8086"
  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.id] : e.target.value.trim()
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      return setErrorMessage('Lütfen tüm alanları doldurun.')
    }
    try {
      setLoading(true)
      setErrorMessage(null)
      
      const res = await fetch('api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json()
      console.log(data);
      
      if (data.success === false) {
        setLoading(false)
        return setErrorMessage(data.message)
      }
      setLoading(false)
      if (res.ok){
        dispatch(signInSuccess(data.user))
        dispatch(setToken(data.access_token))
        navigate('/')
      }
      
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen mt-20 p-2'>
      <div className='flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* Left */}
        <div className='flex-1'>
          <Link 
            to='/' 
            className='flex flex-row items-center font-bold dark:text-white text-4xl'
          >
            <span className='px-2 py-1 italic'>
              Bilim Sözlüğü
            </span>
            <img src={logoURL} alt='img' className='ml-2 w-20 '/>
          </Link>
          <p className='text-sm mt-5'>
            Bilimseverlerin buluşma paneli
          </p>
        </div>
      
      {/* right */}
      <div className='flex-1'>
        <form className='flex flex-col gap-4' autoComplete='false' onSubmit={handleSubmit}>
          <div>
            <Label value='E-posta'/>
            <TextInput
              type='email'
              placeholder='birisi@gmail.com'
              id='email'
              onChange={handleChange}
            />
          </div>
          <div>
            <Label value='Şifre'/>
            <TextInput
              type='password'
              placeholder='********'
              id='password'
              onChange={handleChange}
            />
          </div>
          <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
            {
              loading ? (<>
                <Spinner size='sm' />
                <span className='pl-3'>Loading...</span>
              </>
              ) : 'Giriş Yap' 
            }
          </Button>
          <OAuth />
        </form>
        <div className='flex gap-2 text-sm mt-5'>
          <span>Hesabınız yok mu? </span>
          <Link to='/kayit-ol' className='text-blue-500'>
            Kayıt Ol
          </Link>
        </div>
        {
          errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )
        }
      </div>
      </div>
    </div>
  )
}
