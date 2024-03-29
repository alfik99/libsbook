import React, { Component } from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { Row, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import './carousel.css'


const handleGetDetail = (id) => {
    window.location.href = `/home/detail-book/${id}`
}

class Carousel2 extends Component {
    constructor() {
        super()
        this.state = {
            index: 2,
            properties: [],
            property: {},
        }
    }

    componentDidMount = () => {
        //Carousel
        Axios.get('http://localhost:3010/books?limit=6')
            .then(res => {
                this.setState({ properties: res.data.data, property: res.data.data[0] });
            })
            .catch(err => console.log('err = ', err));
    }

    nextProperty = () => {
        const newIndex = this.state.index + 1;
        this.setState({
            property: this.state.properties[newIndex],
            index: newIndex
        })
    }

    prevProperty = () => {
        const newIndex = this.state.index - 1;
        this.setState({
            property: this.state.properties[newIndex],
            index: newIndex
        })
    }

    render() {
        const { index, properties } = this.state;
        return (
            <Row className={`container1 cards-slider active-slide-${index}`}>
                <div className="cards-slider-wrapper" style={{
                    'transform': `translateX(-${index * (100 / properties.length)}%)`
                }}>
                    {
                        properties.map((bookData, index) =>
                            <Card className="card-carousel wrap" key={bookData.id} id={`card-${index}`} style={{ backgroundImage: `url(${bookData.image})` }} onClick={() => handleGetDetail(bookData.id)}>
                                <Card.Body></Card.Body>
                                <Card.Footer className="footer">
                                    <h3 className="mb-2">{bookData.title}</h3>
                                    {bookData.genre}
                                </Card.Footer>
                            </Card>
                        )
                    }
                </div>
                <div className="btn-slide">
                    <Button variant="light" className="slide-left" onClick={() => this.prevProperty()} disabled={index === 0}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </Button>
                    <Button variant="light" className="slide-right" onClick={() => this.nextProperty()} disabled={index === properties.length - 1}>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </Button>
                </div>
            </Row>
        )
    }
}

Carousel2.propTypes = {
    property: PropTypes.object.isRequired
}

export default Carousel2;