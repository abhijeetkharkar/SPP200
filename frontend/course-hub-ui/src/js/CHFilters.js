import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/search.css';
import { Modal, Button, Form, Col, Badge } from 'react-bootstrap';
//const Range = Slider.Range;

class CHFilters extends Component {

    constructor(props) {
        super(props);
        this.componentWillMount=()=>{
            this.selectedproviders=new Set();
        }
        this.state = {
            courseproviders: new Set([]),
            minprice: 0,
            maxprice: 0,
            startdate: '',
            enddate: ''
        };
        
        this.handleproviderchange = this.handleproviderchange.bind(this);
        this.handleminpricechange = this.handleminpricechange.bind(this);
        this.handleminpricechange = this.handleminpricechange.bind(this);
        this.handlestartdatechange = this.handlestartdatechange.bind(this);
        this.handleenddatechange = this.handleenddatechange.bind(this);
        this.applyfilter = this.applyfilter.bind(this);
    }

    handleproviderchange = e => {
        if(this.selectedproviders.has(e.currentTarget.id)){
            this.selectedproviders.delete(e.currentTarget.id)
        }
        else{
            this.selectedproviders.add(e.currentTarget.id)
        }
        this.setState({courseproviders : this.selectedproviders});
        console.log(this.state.courseproviders)
    }

    handleminpricechange = e =>{
        console.log('Min Price: ',e.target.value)
        this.setState({minprice:e.target.value})
    }

    handlemaxpricechange = e =>{
        console.log('Max Price: ',e.target.value)
        this.setState({maxprice:e.target.value})
    }

    handlestartdatechange = e =>{
        console.log('Start Date: ',e.target.value)
        this.setState({startdate:e.target.value})
    }

    handleenddatechange = e =>{
        console.log('Start Date: ',e.target.value)
        this.setState({enddate:e.target.value})
    }
    
    applyfilter = e => {
		e.preventDefault();
        e.stopPropagation();
        //this.setState({pageNumber: pageNumber});
        //this.props.history.push('/search?searchString=' + searchString + "&pageNumber=" + pageNumber);
        this.props.updateFilter(this.props.searchString, 0, this.state )
	}
 
    render() {
        // console.log("Height",window.innerHeight)
        var customStyle = {
            height: "80vh",
            marginTop: window.outerHeight * 0.11
        }

        return (
            <div className="left-lane" style={customStyle} >
                <div className="left-lane-title">
                    Filters
                </div>
                <Form className="filter-form" onSubmit={e => this.applyfilter(e)}>
                    <Form.Row>
                        <label className="provider"><strong>Course Provider </strong></label>
                    </Form.Row>
                    <Form.Row>
                        <Form.Check className="company" label="EdX" id="EDX" onChange={this.handleproviderchange} />
                    </Form.Row>
                    <Form.Row>
                        <Form.Check className="company" label="Iversity" id="Iversity" onChange={this.handleproviderchange} />
                    </Form.Row>
                    <Form.Row>
                        <Form.Check className="company" label="Udemy" id="udemy" onChange={this.handleproviderchange} />
                    </Form.Row>
                    <Form.Row>
                        <Form.Check className="company" label="Udacity" id="udacity" onChange={this.handleproviderchange} />
                    </Form.Row>
                    <br />
                    <Form.Row>
                        <label className="pricerange"><strong>Price</strong></label>
                        <input className="pricebox" placeholder="Min" onChange={this.handleminpricechange} value={this.state.minprice} type="number" />
                        &nbsp;-&nbsp;
                        <input className="pricebox" placeholder="Max" onChange={this.handlemaxpricechange} value={this.state.maxprice} type="number" />
                    </Form.Row>
                    <br />
                    <Form.Row>
                        <label className="daterange"><strong>Start Date</strong></label>
                    </Form.Row>
                    <Form.Row>
                         <input className="date" placeholder="Start Date" onChange={this.handlestartdatechange} value={this.state.startdate} type="date" />
                    </Form.Row>
                    <br />
                    <Form.Row>
                        <label className="daterange"><strong>End Date</strong></label>
                    </Form.Row>
                    <Form.Row>
                        <input className="date" placeholder="End Date" onChange={this.handleenddatechange} value={this.state.enddate} type="date" />
                    </Form.Row>
                    <br />
                    <Form.Row><Button className="filter-button" size="md"  type="submit">Filter</Button></Form.Row>

                </Form>
            </div>
        );
    }
}


export default CHFilters;
