import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import OAuth from '../components/OAuth'

export default function SignUp() {
  const logoURL = "https://firebasestorage.googleapis.com/v0/b/bilim-sozlugu.appspot.com/o/Ana_Logo.png?alt=media&token=75e3a1b4-c5d6-4cb9-927f-9008120e8086"
  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.id] : e.target.value.trim()
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Lütfen tüm alanları doldurun.')
    }
    try {
      setLoading(true)
      setErrorMessage(null)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success === false) {
        setLoading(false)
        return setErrorMessage(data.message)
      }
      setLoading(false)
      if (res.ok){
        navigate('/giris-yap')
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
            Burada aciklayici veya havali bir yazi olacak... 
          </p>
        </div>
      
      {/* right */}
      <div className='flex-1'>
        <form className='flex flex-col gap-4' autoComplete='false' onSubmit={handleSubmit}>
          <div>
            <Label value='Kullanıcı adı'/>
            <TextInput
              type='text'
              placeholder='Kullanıcı adı'
              id='username'
              onChange={handleChange}
            />
          </div>
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
              ) : 'Kayıt Ol' 
            }
          </Button>
          <OAuth />
        </form>
        <div className='flex gap-2 text-sm mt-5'>
          <span>Hesabınız var mı? </span>
          <Link to='/giris-yap' className='text-blue-500'>
            Giriş Yap
          </Link>
        </div>
        {
          errorMessage && (
            <Alert className='mt-5 absolute' color='failure'>
              {errorMessage}
            </Alert>
          )
        }
        </div>
      </div>
    </div>
  )
}
