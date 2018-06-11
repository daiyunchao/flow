import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import Routes from './router.js'
import './index.css';

const history = createBrowserHistory();
ReactDOM.render(Routes({history}), document.getElementById('root'));
