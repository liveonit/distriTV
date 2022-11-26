import React, { FC, PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
// configs
import { PATH_NAME } from '@app/configs'
import { useUser } from 'src/App/hooks/useUser'

const GuestGuard: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate()
  const user = useUser()
  React.useEffect(() => {
    if (user)
      navigate(PATH_NAME.DASHBOARD)
  }, [user])
  return <>{children}</>
}

export default GuestGuard
