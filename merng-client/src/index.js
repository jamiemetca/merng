import React from 'react';
import ReactDOM from 'react-dom';

import ApolloWrapper from "./Components/ApolloProvider";
import reportWebVitals from './Components/reportWebVitals';
import App from "./Components/App";
import { AuthProvider } from "./Context/Auth";

ReactDOM.render(
  <React.StrictMode>
    <ApolloWrapper>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloWrapper>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
