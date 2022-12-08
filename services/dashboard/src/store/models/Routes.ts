import React, { ComponentType } from 'react'

type Common = {
  exact?: boolean
  path?: string
  guard?:
    | React.LazyExoticComponent<ComponentType<unknown>>
    | ComponentType<unknown>
    | React.FC<{
        children?: React.ReactNode
      }>
  layout?: React.FunctionComponent
  component?: any
  requireRoles?: string[] | []
}

export type RoutesT = Common & {
  routes?: Common[]
}

export type IParams = {
  id?: string
}
