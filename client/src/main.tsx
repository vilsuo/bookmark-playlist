import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Redux
import { Provider } from 'react-redux';
import { setupStore, preloadedState } from './redux/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={setupStore(preloadedState)}>
    <App />
  </Provider>,
);
