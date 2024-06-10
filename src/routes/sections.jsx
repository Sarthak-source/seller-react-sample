import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';
import AddressView from 'src/sections/address/address-view';
import { DashboardView } from 'src/sections/dashboard';
import DeliveryCreate from 'src/sections/dashboard/dispatches/add-internal-do/add-internal-do';
import SalesOrderForm from 'src/sections/dashboard/orders/add-to-sap/add-to-sap';
import OrderCreate from 'src/sections/dashboard/orders/self-order/add-self-order';
import TenderCreate from 'src/sections/dashboard/tender/add-tender/add-tender';
import SalesContractForm from 'src/sections/dashboard/tender/add-to-sap/add-to-sap';
import ProductForm from 'src/sections/product-managment/add-product';
import ProductTableView from 'src/sections/product-managment/product-list';
import UserForm from 'src/sections/sellers/add-sellers';
import UserView from 'src/sections/sellers/sellers-table';
import UpdateTraderForm from 'src/sections/traders/update_trader';
import InboundForm from 'src/sections/warehouse/inbound/inbound-form';
import OutboundForm from 'src/sections/warehouse/outbound/outbound-form';
import ProductBatchForm from 'src/sections/warehouse/product-batch/product-batch-form';
import ProductMFGBatchForm from 'src/sections/warehouse/product-manufacture/product-batch-manufacturing-form';
import WarehouseView from 'src/sections/warehouse/warehouse-management';
import WarehouseForm from 'src/sections/warehouse/warehouse/warehouse-form';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const TenderDetails = lazy(() => import('src/sections/dashboard/tender/tender-details/tender-details'));
export const OrderDetails = lazy(() => import('src/sections/dashboard/orders/order-details/order-details'));
export const AddVehicle = lazy(() => import('src/sections/dashboard/orders/add-vehicle/add-vehicle'));
export const TraderDetails = lazy(() => import('src/pages/traders'));
export const DispatchDetails = lazy(() => import('src/sections/dashboard/dispatches/dispatch-details/loading-instruction-details'));
export const ProfileDetails = lazy(() => import('src/pages/profile'));
export const ReportDetails = lazy(() => import('src/pages/reports'));
export const QualityCheck = lazy(() => import('src/sections/quality_check/quality_check'));
export const ScanWithVehicle = lazy(() => import('src/sections/issue-do/issue-do'));
export const StoreHouse = lazy(() => import('src/sections/issue-do/store-house'));
export const SummaryScreen = lazy(() => import('src/sections/issue-do/summary'));


export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const children = [
    { element: <DashboardView />, index: true },
    { path: 'dashboard', element: <IndexPage />, },
    { path: 'warehouse-management', element: <WarehouseView />, },
    { path: 'blog', element: <BlogPage /> },
    { path: 'tender-details/:id', element: <TenderDetails /> },
    { path: 'add-tender-to-sap', element: <SalesContractForm /> },
    { path: 'order-details/:data', element: <OrderDetails /> },
    { path: 'add-order-to-sap', element: <SalesOrderForm /> },
    { path: 'loading-instruction-details/:id', element: <DispatchDetails /> },
    { path: 'add-vehicle/:data', element: <AddVehicle /> },
    { path: 'tender-create', element: <TenderCreate /> },
    { path: 'self-order-create', element: <OrderCreate /> },
    { path: 'delivery-order-create', element: <DeliveryCreate /> },
    { path: 'quality-check', element: <QualityCheck /> },
    { path: 'generate-invoice', element: <ScanWithVehicle /> },
    { path: 'generate-invoice/store-house', element: <StoreHouse /> },
    { path: 'generate-invoice/store-house/summary', element: <SummaryScreen /> },
    { path: 'traders', element: <TraderDetails /> },
    { path: 'home/traders/update-traders', element: <UpdateTraderForm /> },
    { path: 'profile', element: <ProfileDetails /> },
    { path: 'products', element: <ProductTableView /> },
    { path: 'home/products/add-products', element: <ProductForm /> },
    { path: 'home/sellers-view/add-users', element: <UserForm /> },
    { path: 'sellers-view', element: <UserView /> },
    { path: 'address-view', element: <AddressView /> },
    { path: 'reports', element: <ReportDetails /> },
    { path: 'home/warehouse-management/add-product-form', element: <ProductBatchForm /> },
    { path: 'home/warehouse-management/add-product-mfg-form', element: <ProductMFGBatchForm /> },
    { path: 'home/warehouse-management/add-warehouse-form', element: <WarehouseForm /> },
    { path: 'home/warehouse-management/add-inbound-form', element: <InboundForm/> },
    { path: 'home/warehouse-management/add-outbound-form', element:<OutboundForm/> },


  ];

  const routes = useRoutes([
    {
      element: selectedUser ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <LoginPage>
          <Suspense>
            <Outlet />
          </Suspense>
        </LoginPage>
      ),
      children,
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
      element: <Navigate to="home" replace />,
    },
  ]);

  return routes;
}
