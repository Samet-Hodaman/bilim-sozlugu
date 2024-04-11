import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function OnlyEditorPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user)
  return currentUser && (currentUser.isAdmin || currentUser.isEditor) ? <Outlet /> : <Navigate to='/giris-yap' />
}