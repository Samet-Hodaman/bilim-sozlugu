import { Navbar, Button, Dropdown, Avatar } from 'flowbite-react'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaMoon, FaSun} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice.js'
import { signoutSuccess } from '../redux/user/userSlice.js'

export default function Header() {
  const logoURL = "https://firebasestorage.googleapis.com/v0/b/bilim-sozlugu.appspot.com/o/Ana_Logo.png?alt=media&token=75e3a1b4-c5d6-4cb9-927f-9008120e8086"
	const {currentUser} = useSelector(state => state.user)
	const path = useLocation().pathname
	const {theme} = useSelector(state => state.theme)
	const dispatch = useDispatch()
  const navigate = useNavigate()

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
  };

  return (
  <Navbar className='border-b-2'>
    <Link to='/' className='flex items-center whitespace-nowrap text-sm sm:text-lg font-semibold dark:text-white'>
			<img src={logoURL} className='w-14 md:w-16 '/>
			<span className='indent-2.5 text-md md:text-xl italic'>Bilim Sözlüğü</span>
  	</Link>

		<div className='flex items-center gap-3'>
			{/* Theme change button */}
			<Button 
				className='w-12 h-10 sm:inline' 
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
			{/* Home & About & Contents Navbar */}
			<Navbar.Collapse>
				<Navbar.Link active={path === '/'} as={'div'}>
					<Link to='/'> Anasayfa </Link>
				</Navbar.Link>
				<Navbar.Link active={path === '/hakkinda'} as={'div'}>
					<Link to='/hakkinda'> Hakkımızda </Link>
				</Navbar.Link>
				<Navbar.Link active={path === '/icerikler'} as={'div'}>
					<Link to='/icerikler'> Gönderiler </Link>
				</Navbar.Link>
			</Navbar.Collapse>
			{/* Toggle for Navbar */}
  </Navbar>
  )
}
