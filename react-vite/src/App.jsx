import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './redux/store';
import Layout from './router/Layout';

// Destructure to get the actual store and persistor
const { store, persistor } = configureStore();

function App() {
  return (
    <Provider store={store}> {/* Pass just the store object */}
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
