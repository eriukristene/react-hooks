import React, { useEffect, Suspense } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

// can use this instead of asyncComponent
// lazy loading
// need to be capitalized because we want to use them as JSX elements
const Checkout = React.lazy(() => {
  return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders');
});

const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
});

// didn't have to change much here, except componentDidMount() to
// useEffect(), get rid of this.props, and check capitlization of app
// Lesson 452
const app = props => {
  useEffect(() => {
    props.onTryAutoSignup();
    // second argument [] will prevent the function from running every time
    // the component re-renders
    // if there are things in the array, the function will only run
    // when these things change
    // empty array means this will only run once
    // when the component mounts essentially
  }, []);

  let routes = (
    <Switch>
      {/* have to pass in props / forward the props to all these
      components so they can be accessed in the components
      send them using the spread operator so we are sending
      everything */}
      <Route path="/auth" render={props => <Auth {...props} />} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to="/" />
    </Switch>
  );

  if (props.isAuthenticated) {
    routes = (
      <Switch>
        {/* need to switch from component to render, because
        // we are not using asyncComponent anymore, we have
        // switch to lazy loading */}
        <Route path="/checkout" render={props => <Checkout {...props} />} />
        <Route path="/orders" render={props => <Orders {...props} />} />
        <Route path="/logout" component={Logout} />
        <Route path="/auth" render={props => <Auth {...props} />} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );
  }

  // every functional component has to return JSX
  return (
    <div>
      <Layout>
        {/* need to use Suspense here to make lazy loading possible */}
        <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
      </Layout>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(app)
);
