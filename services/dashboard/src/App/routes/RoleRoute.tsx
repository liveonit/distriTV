import React, { FC, PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUser } from '../hooks/useUser'

type IProps = {
  requiredRoles: string[] | []
}

const RoleRoute: FC<IProps & PropsWithChildren> = ({ children, requiredRoles = [] }) => {
  const navigate = useNavigate()
  const user = useUser()

  console.log({ userRoles: user?.roleMappings, requiredRoles })
  useEffect(() => {
    if (requiredRoles.length > 0) return
    const checkRole = user?.roleMappings.reduce((prev, curr) => prev || requiredRoles.includes(curr.role.name), false)
    if (!checkRole) {
      console.log({ checkRole, requiredRoles, user })
      //navigate(PATH_NAME.LOGIN)
    }
  }, [navigate, requiredRoles, user])
  return <>{children}</>
}

export default RoleRoute
