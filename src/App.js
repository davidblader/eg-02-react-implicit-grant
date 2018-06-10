import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Layout from './hoc/Layout/Layout';
import Home from './containers/Home/Home';
import Logout from './containers/Auth/Logout/Logout';
import Authenticate from './containers/Auth/Authenticate/Authenticate';
import * as actions from './store/actions/index';
import ListEnvelopes from './containers/ListEnvelopes/ListEnvelopes';
import PleaseAuthenticate from './containers/Auth/PleaseAuthenticate/PleaseAuthenticate';
import Loading from './components/UI/Loading/Loading';
import SendSignEnvelope from './containers/SendSignEnvelope/SendSignEnvelope';

import { withAlert } from "react-alert";

class App extends Component {
  componentDidMount () {
    this.props.dsAuthStartup(); // Start me up!
  }

  componentDidUpdate(){
    if (this.props.alertMsg) {
        this.props.alert.show(this.props.alertMsg);
        this.props.alertReset();
    }
    if (this.props.routerReplace) {
      this.props.history.replace(this.props.routerReplace);
      this.props.routerReplaceReset();
    }
    if (this.props.newAuthenticationRedirection) {
      this.props.history.push(this.props.newAuthenticationRedirection);
      this.props.newAuthenticationRedirected();
    }
  }   

  render () {
    let routes = (
      <Switch>
        <Route path="/logout" component={Logout} />
        <Route path="/dsAuthenticate" component={PleaseAuthenticate} />
        <Route path="/authenticate" component={Authenticate} />
        <Route path="/listEnvelopes" component={ListEnvelopes} />
        <Route path="/SendSignEnvelope" component={SendSignEnvelope} />
        <Route path="/" exact component={Home} />
        <Redirect to="/" />
      </Switch>
    );

    if ( this.props.loadingMsg ) {
      routes = <Loading msg={this.props.loadingMsg} />
    }

    const name = this.props.name ? <span>User: {this.props.name};</span> : null
        , accountName = this.props.accountName ? <span> Account: {this.props.accountName}.</span> : null
        // Account change not implemented yet...
        //, accountChange = this.props.accountChange ?
        //  <span><i> Change</i></span> : null
        // , userAccount = <p className='accountDisplay'>{name}{accountName}{accountChange}</p>
        , userAccount = <p className='accountDisplay'>{name}{accountName}</p>
        ;

    return (
      <div>
        <Layout>
          {userAccount}
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.dsAuth.token !== null,
    loadingMsg: state.loading.loadingMsg,
    alertMsg: state.loading.alertMsg,
    accountName: state.dsAuth.accountName,
    name: state.dsAuth.name,
    accountChange: state.dsAuth.accounts.length > 1,
    newAuthenticationRedirection: state.dsAuth.newAuthentication && state.dsAuth.authRedirect,
    routerReplace: state.dsAuth.routerReplace
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dsAuthStartup: () => dispatch( actions.dsAuthStartup() ),
    alertReset: () => dispatch( actions.alertReset() ),
    newAuthenticationRedirected: () => dispatch( actions.newAuthenticationRedirected()),
    routerReplaceReset: () => dispatch( actions.setRouterReplace(null) )
  };
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( withAlert( App ) ));
