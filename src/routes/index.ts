import HomeLayout from 'pages/HomeLayout';
import RedirectPage from 'pages/RedirectPage';
import Welcome from 'pages/Welcome';

const routes: any[] = [
  {
    path: '/welcome',
    component: Welcome,
  },
  {
    path: '/main',
    component: RedirectPage,
  },
  {
    path: '/main/:ipnsCid/*',
    component: HomeLayout,
  },
];

export default routes;
