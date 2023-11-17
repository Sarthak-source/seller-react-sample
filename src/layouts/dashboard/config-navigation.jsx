import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  // {
  //   title: 'home',
  //   path: '/',
  //   icon: icon('ic_user'),
  // },
  {
    title: 'dashboard',
    path: '/home/dashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'product',
    path: '/home/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/home/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/home/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
