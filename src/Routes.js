import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Agreement from './components/Agreement/Agreement'
import Proposals from './components/Proposals/Proposals'
import ProposalDetail from './components/Proposals/ProposalDetail'

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/proposals" />
      <Route exact path="/proposals" component={Proposals} />
      <Route exact path="/proposals/:id" component={ProposalDetail} />
      <Route exact path="/agreement" component={Agreement} />
      <Redirect to="/proposals" />
    </Switch>
  )
}
