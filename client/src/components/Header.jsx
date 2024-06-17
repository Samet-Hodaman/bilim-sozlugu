import { Navbar, Button, Dropdown, Avatar, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaMoon, FaSun} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice.js'
import { signoutSuccess } from '../redux/user/userSlice.js'
import { AiOutlineSearch } from 'react-icons/ai'

export default function Header() {
  const logoURL = "https://firebasestorage.googleapis.com/v0/b/bilim-sozlugu.appspot.com/o/Ana_Logo.png?alt=media&token=75e3a1b4-c5d6-4cb9-927f-9008120e8086"
	const {currentUser} = useSelector(state => state.user)
  const location = useLocation()
	const path = location.pathname
	const {theme} = useSelector(state => state.theme)
  const [searchTerm, setSearchTerm] = useState('')
	const dispatch = useDispatch()
	const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search])

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
        navigate('/')
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/ara?${searchQuery}`)
  }

  return (
  <Navbar className='border-b-2'>
  	{/* Logo and Bilim Sozlugu side */}
    <Link to='/' className='flex items-center whitespace-nowrap text-sm sm:text-lg font-semibold dark:text-white'>
			<img src={logoURL} className='w-12 md:w-16 '/>
			<span className='indent-2.5 text-base md:text-xl italic'>Bilim Sözlüğü</span>
  	</Link>
    <form onSubmit={handleSubmit}>
      <TextInput 
        type='text'
        placeholder='Ara...'
        rightIcon={AiOutlineSearch}
        className='hidden lg:inline'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>

    {/* Home & About & Contents Navbar For mobile size */}
			<Navbar.Collapse>
				<Link to='/'> 
					<Navbar.Link active={path === '/'} as={'div'} to='/'>
						Anasayfa
					</Navbar.Link>
				</Link>
				<Link to='/hakkimizda'>
					<Navbar.Link active={path === '/hakkinda'} as={'div'} to='/hakkimizda'>
						Hakkımızda
					</Navbar.Link>
				</Link>
				<Link to='/icerikler'>
					<Navbar.Link active={path === '/icerikler'} as={'div'} to='/icerikler'>
						Gönderiler
					</Navbar.Link>
				</Link>
			</Navbar.Collapse>

    <div className='flex items-center gap-3'>
			{/* Theme change button */}
			<Button
				className='h-10 md:w-12 sm:inline'
				color='gray'
				pill
				onClick={() => {dispatch(toggleTheme()) }}
			>
				{theme === 'light' ? <FaSun/> : <FaMoon/>}
			</Button>

			{/* Sign in & Profile Buttons */}
			{currentUser ? (
				<Dropdown
					arrowIcon={false}
					inline
					label={
						<Avatar alt={currentUser.isAdmin ? 'admin' : currentUser.isEditor ? 'editor' : 'user'} img={currentUser.profilePicture} rounded />
					}
				>
					<Dropdown.Header>
						<span className='block text-sm'>@{currentUser.username}</span>
						<span className='block text-sm font-medium truncate'>
							{currentUser.email}
						</span>
					</Dropdown.Header>
					{ currentUser.isAdmin &&
					<Link to={'/kontrol-paneli?tab=panel'}>
						<Dropdown.Item>Kontrol Paneli</Dropdown.Item>
					</Link>
					}
					<Link to={'/kontrol-paneli?tab=profil'}>
						<Dropdown.Item>Profil</Dropdown.Item>
					</Link>
					<Dropdown.Divider />
					<Dropdown.Item onClick={handleSignout}>Çıkış Yap</Dropdown.Item>
				</Dropdown>
				) : (
				<Link to='/giris-yap'>
					<Button gradientDuoTone='purpleToBlue' outline>
						Giriş Yap
					</Button>
				</Link>
				)
			}
			<Navbar.Toggle />
		</div>
  </Navbar>
  )
}
