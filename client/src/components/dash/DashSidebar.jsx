import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'
import { signoutSuccess } from '../../redux/user/userSlice';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
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
  };
  return (
    <Sidebar className='w-full md:w-56 '>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          {currentUser && currentUser.isAdmin && (
            <Link to='/kontrol-paneli?tab=panel'>
              <Sidebar.Item
                active={tab === 'panel' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Kontrol Paneli
              </Sidebar.Item>
            </Link>
          )}
          <Link to='/kontrol-paneli?tab=profil'>
            <Sidebar.Item
              active={tab === 'profil'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : currentUser.isEditor ? 'Editor' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profil
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to='/kontrol-paneli?tab=kullanicilar'>
              <Sidebar.Item
                active={tab === 'kullanicilar'}
                icon={HiOutlineUserGroup}
                as='div'
              >
                Kullanıcılar
              </Sidebar.Item>
            </Link>
          )}
          {(currentUser.isEditor || currentUser.isAdmin) && (
            <Link to='/kontrol-paneli?tab=gonderilerim'>
              <Sidebar.Item
                active={tab === 'gonderiler'}
                icon={HiDocumentText}
                as='div'
              >
                Gönderilerim
              </Sidebar.Item>
            </Link>
          )}
          <Link to='/kontrol-paneli?tab=yorumlar'>
            <Sidebar.Item
              active={tab === 'yorumlar'}
              icon={HiAnnotation}
              as='div'
            >
              Yorumlarım
            </Sidebar.Item>
          </Link>
          <Sidebar.Item 
            icon={HiArrowSmRight} 
            labelColor='dark' 
            className='cursor-pointer'
            onClick={handleSignout}
          >
            Çıkış Yap
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}
