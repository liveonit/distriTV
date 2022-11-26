import React, { Fragment, lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
// configs
import { PATH_NAME, USER_ROLE } from '@app/configs';
// types
import { IRoutes } from '@store/models/IRoutes';
// layouts
import MainLayout from '@app/layouts/MainLayout';
// containers
import AuthGuard from '@app/guards/AuthGuard';
import GuestGuard from '@app/guards/GuestGuard';

import RoleRoute from './RoleRoute';

// modules
const Error404View = lazy(() => import('../features/Error404View'));
const DenyView = lazy(() => import('../features/DenyView'));
const ProductAdd = lazy(() => import('../features/Product/ProductAdd'));
const ProductList = lazy(() => import('../features/Product/ProductList'));
const Users = lazy(() => import('../features/Users'));
const Dashboard = lazy(() => import('../features/Dashboard'));
const Playbackground = lazy(() => import('../features/Playbackground'));
const Login = lazy(() => import('../features/Login'));
const Kanban = lazy(() => import('../features/Kanban'));

const routesConfig: IRoutes[] = [
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
        path: PATH_NAME.PRODUCT_LIST,
        component: ProductList,
        requireRoles: [USER_ROLE.ADMIN, USER_ROLE.LEAD],
      },
      {
        path: PATH_NAME.PRODUCT_ADD,
        component: ProductAdd,
        requireRoles: [USER_ROLE.ADMIN],
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

const renderRoutes = (routes: IRoutes[]) => {
  return (
    <>
      {routes ? (
        <Suspense fallback={<div />}>
          <Routes>
            {routes.map((route: IRoutes, idx: number) => {
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
