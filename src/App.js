import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import './helpers/Firebase';
import AppLocale from './lang';
import ColorSwitcher from './components/common/ColorSwitcher';
import { NotificationContainer } from './components/common/react-notifications';
import { isMultiColorActive, isDemo } from './constants/defaultValues';
import { getDirection } from './helpers/Utils';
import AuthContextProvider from './components/auth/AuthContext';

const ViewMain = React.lazy(() =>
  import(/* webpackChunkName: "views" */ './views')
);
const ViewApp = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ './views/app')
);
const ViewUser = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './views/user')
);

const Landing = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './views/landing')
);
const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/error')
);
const BookingForm = React.lazy(() =>
  import(/* webpackChunkName: "views-bookingForm" */ './views/bookingForm')
);

const AuthRoute = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        authUser || isDemo ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/user/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }

  render() {
    const { locale, loginUser } = this.props;
    const currentAppLocale = AppLocale[locale];

    return (
      <AuthContextProvider>
        <div className="h-100">
          <IntlProvider
            locale={currentAppLocale.locale}
            messages={currentAppLocale.messages}
          >
            <>
              <NotificationContainer />
              {isMultiColorActive && <ColorSwitcher />}
              <Suspense fallback={<div className="loading" />}>
                <Router>
                  <Switch>
                    <AuthRoute
                      path="/app"
                      authUser={loginUser}
                      component={ViewApp}
                    />
                    <Route
                      path="/user"
                      render={(props) => <ViewUser {...props} />}
                    />
                    <Route
                      path="/landing"
                      render={(props) => <Landing {...props} />}
                    />
                    <Route
                      path="/bookingform"
                      render={(props) => <BookingForm {...props} />}
                    />
                    <Route
                      path="/error"
                      exact
                      render={(props) => <ViewError {...props} />}
                    />
                    <Route
                      path="/"
                      exact
                      render={(props) => <ViewMain {...props} />}
                    />
                    <Redirect to="/error" />
                  </Switch>
                </Router>
              </Suspense>
            </>
          </IntlProvider>
        </div>
      </AuthContextProvider>
    );
  }
}

const mapStateToProps = ({ authUser, settings }) => {
  const { user: loginUser } = authUser;
  const { locale } = settings;
  return { loginUser, locale };
};
const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(App);
