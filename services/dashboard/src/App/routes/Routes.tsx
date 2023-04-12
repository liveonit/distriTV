import React, { Fragment, lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
// configs
import { PATH_NAME, USER_ROLE } from '@app/configs';
// layouts
import MainLayout from '@app/layouts/MainLayout';
// containers
import AuthGuard from '@app/guards/AuthGuard';
import GuestGuard from '@app/guards/GuestGuard';
import { RoutesT } from 'src/store/app/app.type';

import RoleRoute from './RoleRoute';
import Content from '../features/Content';

// modules
const Error404View = lazy(() => import('../features/Error404View'));
const DenyView = lazy(() => import('../features/DenyView'));
const Institutions = lazy(() => import('../features/Institution/index'));
const Users = lazy(() => import('../features/Users'));
const Dashboard = lazy(() => import('../features/Dashboard'));
const Playbackground = lazy(() => import('../features/Playbackground'));
const Login = lazy(() => import('../features/Login'));
const Kanban = lazy(() => import('../features/Kanban'));
const Television = lazy(() => import('../features/Television'));
const Label = lazy(() => import('../features/Label'));


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
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.LEAD],
      },
      {
        path: PATH_NAME.PLAY_BACKGROUND,
        component: Playbackground,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.LEAD],
      },
      {
        path: PATH_NAME.INSTITUTION,
        component: Institutions,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.LEAD],
      },
      {
        path: PATH_NAME.CONTENT,
        component: Content,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.LEAD],
      },
      {
        path: PATH_NAME.TELEVISION,
        component: Television,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.LEAD],
      },
      {
        path: PATH_NAME.LABEL,
        component: Label,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.LEAD],
      },
      {
        path: PATH_NAME.KANBAN,
        component: Kanban,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.LEAD],
      },
      {
        path: PATH_NAME.USERS,
        component: Users,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.LEAD],
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
];

const renderRoutes = (routes: RoutesT[]) => {
  return (
    <>
      {routes ? (
        <Suspense fallback={<div />}>
          <Routes>
            {routes.map((route: RoutesT, idx: number) => {
              const Guard = route.guard || Fragment;
              const Layout = route.layout || Fragment;
              const Component = route.component;
              // FIXME
              const requireRoles: string[] = []; // route.requireRoles ||
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
                          <RoleRoute requireRoles={requireRoles}>
                            <Component />
                          </RoleRoute>
                        )}
                      </Layout>
                    </Guard>
                  }
                />
              );
            })}
          </Routes>
        </Suspense>
      ) : null}
    </>
  );
};

function RenderRoutes() {
  return renderRoutes(routesConfig);
}

export default RenderRoutes;
