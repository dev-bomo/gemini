import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import View from './components/view/View';
import Api from './dataaccess/Api';
import Login from './components/login/Login';
import styles from './App.module.scss';

function App() {
  let api = useRef(new Api('http://demo.wizzcad.com/', () => { }));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className={styles.blueBkg}>
      {
        isLoggedIn ?
          <View api={api.current} /> :
          <Login api={api.current} onLogin={
            () => {
              setIsLoggedIn(true);
            }} />
      }
    </div>
  );
}

export default App;
