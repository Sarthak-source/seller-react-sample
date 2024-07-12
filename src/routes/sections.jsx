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
import LocationForm from 'src/sections/warehouse/locations/locations-form';
import OutboundForm from 'src/sections/warehouse/outbound/outbound-form';
import ProductBatchForm from 'src/sections/warehouse/product-batch/product-batch-form';
import ProductMFGBatchForm from 'src/sections/warehouse/product-manufacture/product-batch-manufacturing-form';
import WarehouseView from 'src/sections/warehouse/warehouse-management';
import WarehouseForm from 'src/sections/warehouse/warehouse/warehouse-form';

// Lazy-loaded pages and components
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

// Main Router component
export default function Router() {
  // Fetching the selectedUser state from Redux store
  const selectedUser = useSelector((state) => state.user.selectedUser);

  // Define children routes and components
  const children = [
    { element: <DashboardView />, index: true },  // Default dashboard view
    { path: 'dashboard', element: <IndexPage />, },  // Dashboard page
    { path: 'warehouse-management', element: <WarehouseView />, },  // Warehouse management page
    { path: 'blog', element: <BlogPage /> },  // Blog page
    { path: 'tender-details/:id', element: <TenderDetails /> },  // Tender details page
    { path: 'add-tender-to-sap', element: <SalesContractForm /> },  // Add tender to SAP form
    { path: 'order-details/:data', element: <OrderDetails /> },  // Order details page
    { path: 'add-order-to-sap', element: <SalesOrderForm /> },  // Add order to SAP form
    { path: 'loading-instruction-details/:id', element: <DispatchDetails /> },  // Loading instruction details page
    { path: 'add-vehicle/:data', element: <AddVehicle /> },  // Add vehicle form
    { path: 'tender-create', element: <TenderCreate /> },  // Tender creation form
    { path: 'self-order-create', element: <OrderCreate /> },  // Self-order creation form
    { path: 'delivery-order-create', element: <DeliveryCreate /> },  // Delivery order creation form
    { path: 'quality-check', element: <QualityCheck /> },  // Quality check page
    { path: 'generate-invoice', element: <ScanWithVehicle /> },  // Generate invoice page
    { path: 'generate-invoice/store-house', element: <StoreHouse /> },  // Store house page
    { path: 'generate-invoice/store-house/summary', element: <SummaryScreen /> },  // Summary screen for store house
    { path: 'traders', element: <TraderDetails /> },  // Traders page
    { path: 'home/traders/update-traders', element: <UpdateTraderForm /> },  // Update traders form
    { path: 'profile', element: <ProfileDetails /> },  // Profile page
    { path: 'products', element: <ProductTableView /> },  // Products page
    { path: 'home/products/add-products', element: <ProductForm /> },  // Add products form
    { path: 'home/sellers-view/add-users', element: <UserForm /> },  // Add users form
    { path: 'sellers-view', element: <UserView /> },  // Sellers view page
    { path: 'address-view', element: <AddressView /> },  // Address view page
    { path: 'reports', element: <ReportDetails /> },  // Reports page
    { path: 'home/warehouse-management/add-product-form', element: <ProductBatchForm /> },  // Add product batch form
    { path: 'home/warehouse-management/add-product-mfg-form', element: <ProductMFGBatchForm /> },  // Add product manufacturing batch form
    { path: 'home/warehouse-management/add-warehouse-form', element: <WarehouseForm /> },  // Add warehouse form
    { path: 'home/warehouse-management/add-inbound-form', element: <InboundForm /> },  // Add inbound form
    { path: 'home/warehouse-management/add-outbound-form', element: <OutboundForm /> },  // Add outbound form
    { path:'home/locations-management/add-locations-form', element: <LocationForm /> },
  ];

  // Define the main routes configuration
  const routes = useRoutes([
    {
      // If selectedUser is true, render DashboardLayout with Outlet (nested routes)
      element: selectedUser ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        // If no selectedUser, render LoginPage with Outlet (nested routes)
        <LoginPage>
          <Suspense>
            <Outlet />
          </Suspense>
        </LoginPage>
      ),
      children,  // Pass the children routes to this route configuration
    },
    {
      path: 'sign-up',  // Signup path
      element: (
        <SignUpPage>
          <Suspense>
            <Outlet />
          </Suspense>
        </SignUpPage>
      ),
      children  // Pass children routes for signup page
    },
    {
      path: 'home',  // Home path
      element:
        (
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        ),
      children  // Pass children routes for home page
    },
    {
      path: '404',  // 404 page not found path
      element: <Page404 />,  // Render Page404 component
    },
    {
      path: '*',  // Catch-all path (redirects to home)
      element: <Navigate to="home" replace />,  // Redirect to 'home' page
    },
  ]);

  return routes;  // Return the configured routes
}
