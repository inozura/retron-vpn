import { render } from 'react-dom';
import { MemoryRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'simplebar/dist/simplebar.min.css';

render(
  <SnackbarProvider>
    <Router>
      <App />
    </Router>
  </SnackbarProvider>,
  document.getElementById('root')
);
