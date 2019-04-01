import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import '../css/card.css';


class CHDealsCard extends React.Component {

  constructor(props, context){
    super(props, context);
    this.state = {
      title: this.props.title || "Title",
      description: this.props.description || "Description",
      imageLink: this.props.imageLink || "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2F276*180px.svg?alt=media&token=0d8e5d9d-9087-4135-944b-fe9b87b96fb0",
      originalPrice: this.props.originalPrice || 0,
      discountedPrice: this.props.discountedPrice || 0,
      thumbsUp: this.props.thumbsUp || 0,
      datePosted: this.props.datePosted || "None",
      provider: this.props.provider || "None",
    }
  }

  // state = { expanded: false };

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
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <i>&#128077; +{this.state.thumbsUp}</i> 
          </div>
        </div>
      </div>
    );
  }
}

export default CHDealsCard;