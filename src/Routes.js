import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Agreement from './components/Agreement/Agreement'
import Proposals from './components/Proposals/Proposals'
import ProposalSingle from './components/Proposals/ProposalSingle'
import StakeManagement from './components/Stake/StakeManagement'

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/proposals" />
      <Route exact path="/proposals" component={Proposals} />
      <Route exact path="/proposals/:id" component={ProposalSingle} />
      <Route exact path="/agreement" component={Agreement} />
      <Route exact path="/stake-management" component={StakeManagement} />
      <Redirect to="/proposals" />
    </Switch>
  )
}
