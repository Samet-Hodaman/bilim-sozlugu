import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import DashSidebar from '../components/dash/DashSidebar'
import DashProfile from '../components/dash/DashProfile'
import DashPosts from "../components/dash/DashPosts"
import DashUsers from "../components/dash/DashUsers"
import DashComments from "../components/dash/DashComments"
import DashboardComp from "../components/dash/DashboardComp"

export default function Dashboard() {
  const location = useLocation()
	const [tab, setTab] = useState('')
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search)
		const tabFromUrl = urlParams.get('tab')
		setTab(tabFromUrl)
	},[location.search])
  
  return (
  <div className="min-h-screen flex flex-col md:flex-row">
		<div className='md:w-56'>
			{/* Sidebar */}
			<DashSidebar />
		</div>
		{/* Profile */}
		{tab === 'panel' && <DashboardComp />}
		{tab === 'profil' && <DashProfile />}
		{tab === 'gonderilerim' && <DashPosts />}
		{tab === 'kullanicilar' && <DashUsers />}
		{tab === 'yorumlar' && <DashComments />}
  </div>
  )
}
