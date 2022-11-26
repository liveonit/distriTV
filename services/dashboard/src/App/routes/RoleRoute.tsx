import React, { FC, PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// configs
import { PATH_NAME, USER_ROLE } from '@app/configs'


type IProps = {
  requireRoles: string[] | []
}

const RoleRoute: FC<IProps & PropsWithChildren> = ({ children, requireRoles = [] }) => {
  const navigate = useNavigate()
  const role = USER_ROLE.ADMIN

  useEffect(() => {
    if (!role && requireRoles.length > 0) return

    const checkRole = true // requireRoles.includes(role)
    if (!checkRole) {
      navigate(PATH_NAME.ERROR_403)
    }
  }, [navigate, role, requireRoles])
  return <>{children}</>
}

export default RoleRoute
