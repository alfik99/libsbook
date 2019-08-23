import React, { createContext, Component } from 'react';
import Axios from 'axios';

const RootContext = createContext();
// Provider
const Provider = RootContext.Provider;
const GlobalProvider = (Childern) => {
    return (
        class ParentComp extends Component {
            state = {
                users: [],
                alluser: [],
                years: [],
                transaction: [],
                title: "",
                page: 1,
                coloum: "B.Title",
                token: "",
                user: {
                    id: 4,
                    Email: "",
                    Username: "",
                    Full_name: "",
                    access: "",
                    create_at: "",
                    update_at: ""
                },
                modal: false,
                book: [],
                genre: [],
                formgenre: {
                    id: 1,
                    NameOfGenre: ""
                },
                formDataUser: {
                    email: "",
                    username: "",
                    full_name: "",
                    password: ""
                },
                formData: {
                    Image: "",
                    Title: "",
                    DateReleased: "",
                    id_genre: 1,
                    id_status: 2,
                    Description: ""
                },
                isUpdateData: false,
                sidebar: true
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
                if (this.state.sidebar === true) {
                    this.openNav()
                    this.setState({
                        sidebar: false
                    })
                } else {
                    this.closeNav()
                    this.setState({
                        sidebar: true
                    })
                }
            }
            toggle = () => {
                if (this.state.modal === false) {
                    this.setState({
                        modal: true
                    })
                    const style1 = document.getElementById("mySidenav")
                    if(style1 === null){
                    } else{
                        document.getElementById("mySidenav").style.width = "0";
                        document.getElementById("main").style.marginLeft = "0";
                        document.getElementById("mySidenav").style.display = "none";
                    }
                } else {
                    this.setState({
                        modal: false
                    })
                }
            }
            getGenreAPI = () => {
                Axios.get(`http://localhost:3010/genre`)
                    .then((respons) => {
                        console.log(respons.data.data);
                        this.setState({
                            genre: respons.data.data
                        })
                    })
            }
            getTransactionAPI = () => {
                Axios.get(`http://localhost:3010/transaction/`)
                    .then((respons) => {
                        console.log(respons.data.data);
                        this.setState({
                            transaction: respons.data.data
                        })
                    })
            }
            getYearAPI = () => {
                Axios.get(`http://localhost:3010/books/year/`)
                    .then((respons) => {
                        console.log(respons.data.data);
                        this.setState({
                            years: respons.data.data
                        })
                    })
            }
            getPostAPI = (title, coloum, page, available) => {
                const mTitle = title || " "
                const mColoum = coloum || "B.Title"
                const mPage = page || 1
                const mavailable = available || "available"
                Axios.get(`http://localhost:3010/books?search=${mTitle}&available=${mavailable}&coloum=${mColoum}&sort=id&by=DESC&limit=12&page=${mPage}`)
                    .then((respons) => {
                        // console.log(respons);
                        this.setState({
                            book: respons.data.data,
                            coloum: mColoum,
                            page: mPage,
                            title: mTitle
                        })
                    })
            }
            getSearchPostAPI = () => {
                Axios.get(`http://localhost:3010/books?search=${this.state.title}&coloum=${this.state.coloum}&sort=id&by=DESC&limit=12&page=${this.state.page}`)
                    .then((respons) => {
                        this.setState({
                            book: respons.data.data
                        })
                        console.log('axios get')
                        // setInterval(() => {
                        //     this.setState({
                        //         title: " ",
                        //         coloum: "B.Title"
                        //     })
                        // }, 10000);
                        // if(this.state.book !== null){
                        // }
                    })
            }
            getUserToken = () => {
                Axios.get(`http://localhost:3010/user/`)
                    .then((respons) => {
                        this.setState({
                            alluser: respons.data.data
                        })
                    })
                console.log('token', this.state.token)
                console.log('token', document.cookie.split("=")[1])
            }
            dispatch = (action) => {
                if (action.type === 'PLUS_PAGE') {
                    if(this.state.book.length < 12){
                        
                    } else {
                        let page = this.state.page + 1
                        this.getPostAPI(" ", "B.Title", page)
                    }
                }
                if (action.type === 'MINUS_PAGE') {
                    if (this.state.page > 1) {
                        let page = this.state.page - 1
                        this.getPostAPI(" ", "B.Title", page)
                    }else{
                        return this.getPostAPI()
                    }
                }
            }
            handleSearch = (event) => {
                var newColoum = { ...this.state.coloum }
                newColoum = event.target.name
                var newTitle = { ...this.state.title }
                newTitle = event.target.value
                console.log('form change', event.target.value)
                console.log('name change', event.target.name)
                this.setState({
                    title: newTitle,
                    coloum: newColoum
                })
            }
            componentDidMount() {
                console.log('mount')
                this.getPostAPI()
                this.getGenreAPI()
                this.getTransactionAPI()
            }
            handleSubmit = (event) => {
                const page = 1
                if (event.key === "Enter") {
                    // console.log(event.key)
                    // console.log(event.target.value)
                    this.setState({
                        title: event.target.value,
                        coloum: event.target.name
                    })
                    this.getSearchPostAPI()
                } else if (event.target.name === "G.NameOfGenre") {
                    this.getPostAPI(event.target.value, event.target.name, page)
                } else if (event.target.name === "B.DateReleased") {
                    this.getPostAPI(event.target.value, event.target.name, page)
                } else if (event.target.name === "borrowed") {
                    this.getPostAPI(" ", null, page, event.target.name)
                } else if (event.target.name === "available") {
                    this.getPostAPI(" ", null, page, event.target.name)
                }
            }
            handleForm = (event) => {
                var newFormData = { ...this.state.formData };
                newFormData[event.target.name] = event.target.value;
                // console.log('form change', event.target.value);
                // console.log('name change', event.target.name);
                this.setState({
                    formData: newFormData
                })
            }
            getPostAPILogin = (data) => {
                Axios.post(`http://localhost:3010/user/signin`, data)
                    .then((response) => {
                        console.log(response.data.data.token);
                        this.setState({
                            user: response.data,
                            token: response.data.data.token
                        })
                        if (response.data.success === true) {
                            document.cookie = 'Token=' + this.state.token
                            window.location.replace('/home')
                            // this.props.state.user = response.data.data.data
                        }
                        console.log(this.state.user);
                    })
                    .catch(err => console.log(err))
            }
            render() {
                return (
                    <Provider value={
                        {
                            state: this.state,
                            toggle: this.toggle,
                            dispatch: this.dispatch,
                            handleSearch: this.handleSearch,
                            handleSubmit: this.handleSubmit,
                            handleForm: this.handleForm,
                            handleSidebar: this.handleSidebar,
                            getYearAPI: this.getYearAPI,
                            getPostAPILogin: this.getPostAPILogin
                        }
                    }>
                        <Childern {...this.props} />
                    </Provider>
                )
            }
        }
    )
}
export default GlobalProvider;

// Consumer
const Consumer = RootContext.Consumer;
export const GlobalConsumer = (Childern) => {
    return (
        class ParentConsumer extends Component {
            render() {
                return (
                    <Consumer>
                        {
                            value => {
                                return (
                                    <Childern {...this.props} {...value} />
                                )
                            }
                        }
                    </Consumer>
                )
            }
        }
    )
}