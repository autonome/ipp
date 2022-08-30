import HomeLayout from 'pages/HomeLayout';
import Welcome from 'pages/Welcome';

const routes: any[] = [
  {
    path: '/welcome',
    component: Welcome,
  },
  {
    path: '/main/*',
    component: HomeLayout,
  },
];

export default routes;
