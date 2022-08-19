import MainLayout from 'pages/MainLayout';
import React from 'react';
import 'styles/app.scss';
import {NotificationContainer} from 'components/Notification';
import 'react-notifications/lib/notifications.css';
import Loader from 'components/Loader';
import { useSelector } from 'react-redux';
import SyncWorker from 'components/SyncWorker';

function App() {
  // const loading = useSelector((store: any) => store.viewStates.loading);

  return (
    <div className="App">
      <SyncWorker />
      <MainLayout />
      <NotificationContainer />
      {/* {loading && <Loader />} */}
    </div>
  );
}

export default App;
