import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/filter-component.css';
import { Modal, Button, Form, Col, Badge } from 'react-bootstrap';
//const Range = Slider.Range;

class CHFilters extends Component {

    constructor(props) {
        super(props);
        this.state = {
          lowerBound: 0,
          upperBound: 0,
          value: [0, 10],
        };
      }

    onLowerBoundChange = (e) => {
        this.setState({ lowerBound: +e.target.value });
      }
      onUpperBoundChange = (e) => {
        this.setState({ upperBound: +e.target.value });
      }
      onSliderChange = (value) => {
        log(value);
        this.setState({
          value,
        });
      }
      handleApply = () => {
        const { lowerBound, upperBound } = this.state;
        this.setState({ value: [lowerBound, upperBound] });
      }

    render() {
        // console.log("Height",window.innerHeight)
        var customStyle = {
            height: "75vh",
            marginTop: window.outerHeight * 0.11
        }

        return (
            <div className="left-lane" style={customStyle} >
             <Form>
             <Form.Row>
                    <label className="pricerange">Price </label>
                    <input className="pricebox" placeholder="Min" type="number" onChange={this.onLowerBoundChange} />
                    &nbsp;-&nbsp;
                    <input className="pricebox" placeholder="Max" type="number" onChange={this.onUpperBoundChange} />
                    <br />
            </Form.Row>
                
               {/*  <input className="my-input-alignment" type="radio" name="searchChoice" id="team" />
                <label className="my-label-alignment" htmlFo r="team">Team</label>
                <input className="my-input-alignment" type="radio" name="searchChoice" id="match" />
                <label className="my-label-alignment" htmlFor="match">Match</label><br />
                <div style={{ textAlign: "center" }}>
                    <button type="button" className="btn btn-info my-button-alignment">Search</button>
                </div> */}
            </Form>
            </div>
        );  
    }
}


export default CHFilters;
