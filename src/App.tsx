import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import View from './view/View';
import Api from './dataaccess/Api';

function App() {
  let api: Api = new Api('http://demo.wizzcad.com/');

  return (
    <div className="App">
      <View api={api} />
    </div>
  );
}

export default App;
