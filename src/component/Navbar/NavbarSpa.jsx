// import ReactDOM from 'react-dom';
import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import { Route } from 'react-router-dom'
import SearchBox from './SearchBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'
import AddModal from '../Modal/Add';
import { connect } from 'react-redux';
import { getGenre } from '../../redux/Actions/Genres';
import { getYear, getFilterBook } from '../../redux/Actions/Books';
import { userInfo } from '../../redux/Actions/Users';
import { getReturn, getBorrow } from '../../redux/Actions/Transaction';
// import Profile from './Profile';

const NoMatch = () => {
    return <h2>404, Not Found</h2>
}
class NavBarSpa extends Component {
    constructor(props){
        super(props)
        this.state = {
            getGenre: [],
            getYear: [],
            sidebar: false,
            getBook: [],
            title: "",
            page: 1,
            coloum: "B.Title",
            status: "available",
        }
    }
    handleSearch = (title) => {
        this.props.filter(title, "B.Title", null, null)
    }
    handleSubmit = (event) => {
        const page = this.state.page
        const status = this.state.status
        if (event.target.name === "G.NameOfGenre") {
            this.props.filter(event.target.value, event.target.name, page, status)
        } else if (event.target.name === "B.DateReleased"){
            this.props.filter(event.target.value, event.target.name, page, status)
        }
    }
    handleHome = () => {
        // document.location.replace("http://localhost:3030/home")
        this.props.history.push('/home')
    }
    handleReload = () => {
        document.location.reload()
    }
    openNav = () => {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        document.getElementById("mySidenav").style.display = "block";

    }
    closeNav = () => {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        document.getElementById("mySidenav").style.display = "none";
    }
    handleSidebar = () => {
        if (this.state.sidebar === false) {
            this.openNav()
            this.setState({
                sidebar: true
            })
        } else {
            this.closeNav()
            this.setState({
                sidebar: false
            })
        }
    }
    handleSignOut =()=>{
        localStorage.clear()
        this.closeNav()
    }
    componentDidMount = async () => {
        await this.props.Genre()
        await this.props.Year()
        await this.props.UserInfo()
        const id_users = this.props.user.userInfo.id
        await this.props.GetBorrow(id_users)
        await this.props.GetReturn(id_users)
        this.setState({
            getGenre: this.props.genre.genreList,
            getYear: this.props.book.yearList,
        })
    }
    render() {
        const { getGenre, getYear } = this.state
        return (
            <Fragment>
                <div id="mySidenav" className="sidenav">
                    <img src="http://clws.karnataka.gov.in/assets/icons/manager.png" alt=""/>
                    <p>{this.props.user.userInfo.Username}</p>
                    <Link onClick={this.handleSidebar} to="/home/explore">Explore</Link>
                    <Link onClick={this.handleSidebar} to="/home/history">History</Link>
                    {
                        this.props.user.userInfo.access === 'admin' ? 
                        <AddModal closeNav={this.handleSidebar} />
                        :
                        ''
                    }
                    <Link onClick={this.handleSignOut} to="/login">Logout</Link>
                </div>
                <nav className="navigation">
                    <span id="burger" onClick={this.handleSidebar}>&#9776;</span>
                    <div className="dropdown">
                        <Link to="/home">
                            <button className="dropbtn">All Category <FontAwesomeIcon icon={faSortDown} /></button>
                        </Link>
                        <div className="dropdown-content">
                            {getGenre ?
                                getGenre.map(genre => {
                                    return <button 
                                    onClick={this.handleSubmit} 
                                    name="G.NameOfGenre" 
                                    key={genre.id} to="#" 
                                    value={genre.NameOfGenre} >{genre.NameOfGenre}
                                    </button>
                                })
                                : <button>Loading...</button>
                            }
                        </div>
                    </div>
                    <div className="dropdown">
                    <Link to="/home">
                        <button className="dropbtn">All Time <FontAwesomeIcon icon={faSortDown} /></button>
                    </Link>
                        <div className="dropdown-content">
                            {getYear ?
                                getYear.map((years,index)=>{
                                    return <button
                                        onClick={this.handleSubmit} 
                                        name="B.DateReleased" 
                                        key={index} to="#"
                                        value={ years.year }>{ years.year }
                                        </button>
                                     
                                })
                                : <button>Loading...</button>
                            }
                        </div>
                    </div>
                    <SearchBox search={this.handleSearch} />
                    <Link to="/home">
                        <img src="https://s3-alpha-sig.figma.com/img/5ef4/f6ec/e84f39e17cc61b2c69a33b9ad6d7736e?Expires=1567382400&Signature=BIb3Rr5PdM4FgT80aIXHtY-1waIiqI3usAtfDL79yrRiUkYzQDJbXcnFgtqcRMfZe2tglbEO2yRBc-vbg5e4FetONSgBVInok4ow7OzjSep5aqbuzcVUoGbqY91URULF1rPQbfqlaQS0JKAVsZkNqGrpnFzFLVQNIQek~vMu5A6oRw2fqKchwZbuEdTY37mRx9G6W5gG1uISPGTreyWYTkkz93Op4-j30UHkcZMGDpmn6qbiDzDdK5mk1He5aqAugRNqEGuEbs3WfvgrDviUeXeLeWPVuwVuQXbbxbWYD8AMBkcTGZPOfhDM4znqjO~K-37~~ndicWGy~8s7yDZ6fg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA" alt="" />                    
                        <span className="library" >Library</span>
                    </Link>
                </nav>
                <Route />
                {/* <Route path='/homespa/profile'
                    render={props => (<Profile {...props} />)} /> */}
                <Route component={NoMatch} />
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        genre: state.genre,
        book: state.book,
        user: state.user,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        UserInfo: () => dispatch(userInfo()),
        Genre: () => dispatch(getGenre()),
        Year: () => dispatch(getYear()),
        GetReturn: (id) => dispatch(getReturn(id)),
        GetBorrow: (id) => dispatch(getBorrow(id)),
        Book: (mTitle, mColoum, mPage, mavailable) => dispatch(getFilterBook(mTitle, mColoum, mPage, mavailable)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NavBarSpa)
