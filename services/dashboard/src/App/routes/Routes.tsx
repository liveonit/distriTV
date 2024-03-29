import React, { Fragment, lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
// configs
import { PATH_NAME } from '@app/configs'
// layouts
import MainLayout from '@app/layouts/MainLayout'
// containers
import AuthGuard from '@app/guards/AuthGuard'
import GuestGuard from '@app/guards/GuestGuard'
import { RoutesT } from 'src/store/app/app.type'
import { RolesE } from 'src/store/user/user.type'

import RoleRoute from './RoleRoute'
import Content from '../features/Content'

// modules
const Error404View = lazy(() => import('../features/Error404View'))
const DenyView = lazy(() => import('../features/DenyView'))
const Institutions = lazy(() => import('../features/Institution/index'))
const Users = lazy(() => import('../features/Users'))
const Dashboard = lazy(() => import('../features/Dashboard'))
const Login = lazy(() => import('../features/Login'))
const Television = lazy(() => import('../features/Television'))
const Label = lazy(() => import('../features/Label'))
const Alert = lazy(() => import('../features/Alert'))
const Agenda = lazy(() => import('../features/Agenda'))

const routesConfig: RoutesT[] = [
  {
    path: '/',
    component: () => <Navigate to={PATH_NAME.DASHBOARD} replace />,
  },
  {
    path: PATH_NAME.ERROR_404,
    component: Error404View,
  },
  {
    guard: GuestGuard,
    path: PATH_NAME.LOGIN,
    component: Login,
  },
  {
    path: PATH_NAME.ERROR_403,
    component: DenyView,
  },
  {
    path: '/*',
    guard: AuthGuard,
    layout: MainLayout,
    routes: [
      {
        path: PATH_NAME.DASHBOARD,
        component: Dashboard,
        requiredRoles: Object.values(RolesE),
      },
      {
        path: PATH_NAME.INSTITUTION,
        component: Institutions,
        requiredRoles: [RolesE.Admin],
      },
      {
        path: PATH_NAME.CONTENT,
        component: Content,
        requiredRoles: [RolesE.Admin],
      },
      {
        path: PATH_NAME.TELEVISION,
        component: Television,
        requiredRoles: Object.values(RolesE),
      },
      {
        path: PATH_NAME.LABEL,
        component: Label,
        requiredRoles: Object.values(RolesE),
      },
      {
        path: PATH_NAME.ALERT,
        component: Alert,
        requiredRoles: Object.values(RolesE),
      },
      {
        path: PATH_NAME.AGENDA,
        component: Agenda,
        requiredRoles: Object.values(RolesE),
      },
      {
        path: PATH_NAME.USERS,
        component: Users,
        requiredRoles: [RolesE.Admin],
      },
      {
        component: () => <Navigate to={PATH_NAME.ERROR_404} replace />,
      },
    ],
  },
  {
    path: '*',
    routes: [
      {
        exact: true,
        path: '/app',
        component: MainLayout,
      },
      {
        component: () => <Navigate to={PATH_NAME.ERROR_404} replace />,
      },
    ],
  },
]

const renderRoutes = (routes: RoutesT[]) => {
  return (
    <>
      {routes ? (
        <Suspense fallback={<div />}>
          <Routes>
            {routes.map((route: RoutesT, idx: number) => {
              const Guard = route.guard || Fragment
              const Layout = route.layout || Fragment
              const Component = route.component
              const requiredRoles: string[] = route.requiredRoles || []
              return (
                <Route
                  key={`routes-${idx}`}
                  path={route.path}
                  element={
                    <Guard>
                      <Layout>
                        {route.routes ? (
                          renderRoutes(route.routes)
                        ) : (
                          <RoleRoute requiredRoles={requiredRoles}>
                            <Component />
                          </RoleRoute>
                        )}
                      </Layout>
                    </Guard>
                  }
                />
              )
            })}
          </Routes>
        </Suspense>
      ) : null}
    </>
  )
}

function RenderRoutes() {
  return renderRoutes(routesConfig)
}

export default RenderRoutes
