import MainLayout from 'pages/MainLayout';
import React, {useEffect} from 'react';
import 'styles/app.scss';
import {NotificationContainer} from 'components/Notification';
import 'react-notifications/lib/notifications.css';
import Loader from 'components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import SyncWorker from 'components/SyncWorker';
import { connectWallet } from 'slices/web3Slice';
import { AppDispatch } from 'slices/store';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((store: any) => store.viewState.loading);

  useEffect(() => {
    dispatch(connectWallet());
  }, [])
  
  return (
    <div className="App">
      <SyncWorker />
      <MainLayout />
      <NotificationContainer />
      {loading && <Loader />}
    </div>
  );
}

export default App;
