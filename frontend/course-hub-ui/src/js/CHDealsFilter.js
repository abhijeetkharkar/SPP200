import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/search.css';
import { Modal, Button, Form, Col, Badge } from 'react-bootstrap';
//const Range = Slider.Range;

class CHDealsFilters extends Component {

    constructor(props) {
        super(props);
        this.componentWillMount=()=>{
            this.selectedproviders=new Set();
        }
        this.state = {
            dealCategory: new Set([]),
        };
        
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.applyfilter = this.applyfilter.bind(this);
    }

    handleCategoryChange = e => {
        if(this.selectedCategory.has(e.currentTarget.id)){
            this.selectedCategory.delete(e.currentTarget.id)
        }
        else{
            this.selectedproviders.add(e.currentTarget.id)
        }
        this.setState({courseproviders : this.selectedproviders});
        console.log(this.state.courseproviders)
    }

    applyfilter = e => {
		e.preventDefault();
        e.stopPropagation();
        //this.setState({pageNumber: pageNumber});
        //this.props.history.push('/search?searchString=' + searchString + "&pageNumber=" + pageNumber);
        this.props.updateFilter(this.state)
	}
 
    render() {
        // console.log("Height",window.innerHeight)
        var customStyle = {
            height: "75vh",
            marginTop: window.outerHeight * 0.11
        }

        return (
            <div className="left-lane" style={customStyle} >
                <Form className="filter-form" onSubmit={e => this.applyfilter(e)}>
                    <Form.Row>
                        <label className="provider">Deal Category: </label>
                    </Form.Row>
                    <Form.Row>
                        <Form.Check className="company" label="General" id="General" onChange={this.handleCategoryChange} />
                    </Form.Row>
                    <Form.Row>
                        <Form.Check className="company" label="Computer Science" id="Computer Science" onChange={this.handleCategoryChange} />
                    </Form.Row>
                    <Form.Row>
                        <Form.Check className="company" label="Sociology" id="Sociology" onChange={this.handleCategoryChange} />
                    </Form.Row>
                    <Form.Row>
                        <Form.Check className="company" label="AI" id="AI" onChange={this.handleCategoryChange} />
                    </Form.Row>

                    
                    <br />
                    <Form.Row><Button className="filter-button" size="sm"  type="submit">Filter</Button></Form.Row>

                </Form>
            </div>
        );
    }
}


export default CHDealsFilters;
