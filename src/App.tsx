import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ReportPage } from './components/ReportPage'
import { ReportList } from './components/ReportList';
import { DefaultToastContainer, Options, ToastProvider } from 'react-toast-notifications'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

export const ERROR_TOAST_OPTIONS: Options = { appearance: 'error', autoDismiss: true }
export const SUCCESS_TOAST_OPTIONS: Options = { appearance: 'success', autoDismiss: true }

const ToastContainer = (props: any) => (
    <DefaultToastContainer
      className="toast-container"
      style={{ zIndex: 2000 }}
      {...props}
    />
  );

function App() {
    return (
        <ToastProvider
            placement="top-center"
            components={{ ToastContainer }}
        >
            <Router>
                <Switch>
                    <Route exact path="/">
                        <div>
                            <div className="header">Report Searcher</div>
                            <ReportList />
                        </div>
                    </Route>
                    <Route exact path="/report/:id" render={({ match }) => (
                        <ReportPage
                            reportId={match.params.id}
                        />
                    )} />
                </Switch>
            </Router>
        </ToastProvider>
    );
}

export default App;
