import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';
import { DashboardView } from 'src/sections/dashboard';
import TenderCreate from 'src/sections/dashboard/tender/add-tender/add-tender';


export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const TenderDetails = lazy(() => import('src/sections/dashboard/tender/tender-details/tender-details'));
export const OrderDetails = lazy(() => import('src/sections/dashboard/orders/order-details/order-details'));
export const TraderDetails = lazy(() => import('src/pages/traders'));
export const ProfileDetails = lazy(() => import('src/pages/profile'));
export const ReportDetails = lazy(() => import('src/pages/reports'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const children = [ 
    {  element: <DashboardView /> , index: true},
    { path: 'dashboard',element: <IndexPage />, },
    { path: 'products', element: <ProductsPage /> },
    { path: 'blog', element: <BlogPage /> },
    { path: 'tender-details/:id', element: <TenderDetails /> },
    { path: 'order-details/:data', element: <OrderDetails /> },
    { path: 'tender-create', element: <TenderCreate /> },
    { path: 'traders', element: <TraderDetails /> },
    { path: 'profile', element: <ProfileDetails /> },
    { path: 'reports', element: <ReportDetails /> },
  ];
  const routes = useRoutes([
    {
      element: (
        <LoginPage>
          <Suspense>
            <Outlet />
          </Suspense>
        </LoginPage>
      ),
      children
    },
    {
      path: 'sign-up',
      element: (
        <SignUpPage>
          <Suspense>
            <Outlet />
          </Suspense>
        </SignUpPage>
      ),
      children
    },
    {
      path: 'home',
      element:
        (
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        ),
      children
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
