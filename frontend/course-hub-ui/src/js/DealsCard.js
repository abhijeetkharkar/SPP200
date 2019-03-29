import React from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import '../css/card.css';


class DealsCard extends React.Component {

  constructor(props, context){
    super(props, context);
    this.state = {
      title: this.props.title,
      description: this.props.description,
      imageLink: this.props.imageLink,
      originalPrice: this.props.originalPrice,
      discountedPrice: this.props.discountedPrice,
      thumbsUp: this.props.thumbsUp,
      datePosted: this.props.datePosted,
      provider: this.props.provider,
    }
  }

  state = { expanded: false };

  render() {
    const { classes } = this.props;
    var customStyle = {
      'text-align': 'left'
    };
    var discountedPrice = {
      'font-size' : '20px',
      'font-weight': 'bold'
    };

    return (
      <div style={customStyle}>
        <div class="card">
          <img class="card-img-top" src={this.state.imageLink} alt="Card image cap" width='276px' height='180px' />
          <div class="card-body">
            <h5 class="card-title"><a href="#">{this.state.title}</a></h5>
            <b> {this.state.provider} </b>
            <p class="card-text"> {this.state.description} </p>
          </div>
          <div class="card-footer">
            <small class="text-muted">Posted : <b>{this.state.datePosted}</b></small>
            <br />
            <div class="deal-strike-through">${this.state.originalPrice}</div>
            &nbsp;&nbsp;&nbsp;
            <div class="deal-notstrike-through" style={discountedPrice}>${this.state.discountedPrice}</div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <i style={discountedPrice} >&#128077; </i> +{this.state.thumbsUp}
          </div>
        </div>
      </div>
    );
  }
}

export default DealsCard;