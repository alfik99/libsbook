import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './Home.css'
import Login from '../page/Login/Login';
import listBook from '../page/listBook/listBook';
import Register from '../page/Register/Register';
import listCard from '../page/listCard/listCard';
import GlobalProvider from '../../context/context';
import ModalAdd from '../../component/Modal/Add';
import ViewDetail from '../page/listCard/viewDetail';
import explore from '../page/listCard/explore';
import MyHistory from '../page/listCard/history'


const NoMatch = () => {
    return <h2>404, Not Found</h2>
}

class Home extends Component {
    render () {
        return (
            <Fragment>
                <Router>
                    <div id="main" >
                        <main> 
                            <Switch>
                                <Route path='/' exact component={Login} />
                                <Route path='/Login' component={Login} />
                                <Route path='/Register' component={Register} />
                                <Route path='/home' exact component={listCard} />
                                <Route path='/home/explore' exact component={explore} />
                                <Route path='/home/history' exact component={MyHistory} />
                                <Route path='/home/CardBook' component={listBook} />
                                <Route path='/home/modal' exact component={ModalAdd} />
                                <Route path='/home/detail-book/:id' component={ViewDetail} />
                                <Route component={NoMatch} />
                            </Switch>
                        </main>
                    </div>
                </Router>
            </Fragment>
        )
    }
}

export default GlobalProvider(Home)
