
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import store from './Store/index.jsx'
import AppRouter from './Routes/AppRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppRouter />
    </Provider>
  
)
