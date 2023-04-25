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
  requiredRoles?: string[] | []
}

export type RoutesT = Common & {
  routes?: Common[]
}

export type IParams = {
  id?: string
}

export type HeadCell = {
  id: string
  label: string
}

export type Order = 'asc' | 'desc'

export type IPagination = {
  perPage: number
  totalPage: number
  pageIndex: number
  order: Order
  orderBy: string
  handleRequestSort: (property: string) => () => void
  changePage: (value: number) => void
  changePerPage: (value: number) => void
}

export type History = {
  push(url: string): void
  replace(url: string): void
}

type Irems = {
  title?: string
  icon?: React.ReactNode
  href?: string
  depth?: number
}

type IStyle = {
  paddingLeft: number
}

export type ChildNavBar = Irems & {
  items?: Irems[]
  pathname: string
  label?: string
}

export type NavBarCommon = {
  subheader?: string
  items: ChildNavBar[]
}

export type NavBarItem = {
  depth: number
  icon: any
  title: string
  open?: boolean
  href: string
  label?: string
  isExternalLink: boolean
  children?: any
}

export type NavBarExpandItem = {
  icon: any
  title: string
  open?: boolean
  children?: any
  style: IStyle
}
