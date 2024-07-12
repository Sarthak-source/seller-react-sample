import SvgColor from 'src/components/svg-color';

// Function to generate SVG icons with dynamic colors
const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

// Array of navigation configuration objects
const navConfig = [
  {
    title: 'home',
    path: '/home',
    icon: icon('ic_home'), // Example of using the icon function to generate an icon component
    access_role: [1] // Array of roles that can access this navigation item (role IDs)
  },
  {
    title: 'dashboard',
    path: '/home/dashboard',
    icon: icon('ic_analytics'),
    access_role: [1],
  },
  {
    title: 'reports',
    path: '/home/reports',
    icon: icon('ic_report'),
    access_role: [1, 4, 2], // Example of multiple roles allowed to access this item
  },
  {
    title: 'Warehouse',
    path: '/home/warehouse-management',
    icon: icon('ic_storehouse'),
    access_role: [1, 2, 3],
  },
  {
    title: 'traders',
    path: '/home/traders',
    icon: icon('ic_trading'),
    access_role: [1, 2],
  },
  {
    title: 'sellers',
    path: '/home/sellers-view',
    icon: icon('ic_user'),
    access_role: [1],
  },
  {
    title: 'products',
    path: '/home/products',
    icon: icon('ic_cart'),
    access_role: [1],
  },
  {
    title: 'Quality check',
    path: '/home/quality-check',
    icon: icon('ic_qc'),
    access_role: [1, 3],
  },
  {
    title: 'Generate Invoice',
    path: '/home/generate-invoice',
    icon: icon('ic_vehilcle'),
    access_role: [1],
  },
  {
    title: 'Address',
    path: '/home/address-view',
    icon: icon('ic_address'),
    access_role: [1],
  },
  {
    title: 'profile',
    path: '/home/profile',
    icon: icon('ic_lock'),
    access_role: [1, 2, 3, 4, 5, 6], // Example of allowing multiple roles to access this item
  },
  // Uncomment or add additional items as needed for your application
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
  // {
  //   title: 'login',
  //   path: '/home/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'home',
  //   path: '/',
  //   icon: icon('ic_user'),
  // },
  // {
  //   title: 'product',
  //   path: '/home/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/home/blog',
  //   icon: icon('ic_blog'),
  // },
];

export default navConfig;
