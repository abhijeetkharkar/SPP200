import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import '../css/card.css';
import firebaseInitialization from '../FirebaseUtils';

class CHDealsCard extends React.Component {

  constructor(props, context){
    super(props, context);
    this.state = {
      id: this.props.id,
      title: (this.props.title.substring(0, 15) + '...') || "Title",
      description: (this.props.description.substring(0, 50) + '...') || "Description",
      imageLink: this.props.imageLink || "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fpluralsight.png?alt=media&token=08635c9a-5b85-4bfb-8334-0fe6fc9dfd97",
      originalPrice: this.props.originalPrice || 0,
      discountedPrice: this.props.discountedPrice || 0,
      thumbsUp: this.props.thumbsUp || 0,
      thumbsDown: this.props.thumbsDown || 0,
      datePosted: this.props.datePosted || "None",
      provider: this.props.provider || "None",
    }
    // console.log("THis props are ", this.props);
    this.loadModal = this.loadModal.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      id: nextProps.id,
      title: (nextProps.title.substring(0, 15) + '...') || "Title",
      description: (nextProps.description.substring(0, 50) + '...') || "Description",
      imageLink: nextProps.imageLink || "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fpluralsight.png?alt=media&token=08635c9a-5b85-4bfb-8334-0fe6fc9dfd97",
      originalPrice: nextProps.originalPrice || 0,
      discountedPrice: nextProps.discountedPrice || 0,
      thumbsUp: nextProps.thumbsUp || 0,
      thumbsDown: nextProps.thumbsDown || 0,
      datePosted: nextProps.datePosted || "None",
      provider: nextProps.provider || "None",
    })
  }

  loadModal = (id) => {
    this.props.showDeal(id);
  }

  render() {
    // const { classes } = this.props;
    var customStyle = {
      'textAlign': 'left'
    };
    var discountedPrice = {
      'fontSize' : '20px',
      'fontWeight': 'bold'
    };
    var imageStyle = {
      'padding' : '2%'
    }

    return (
      <div style={customStyle}>
        <div className="card">
          <img style={imageStyle} className="card-img-top" src={this.state.imageLink} alt="Card image cap" width='276px' height='180px' />
          <div className="card-body">
            <h5 className="card-title"><a href="javascript:void(0);" onClick={e => this.loadModal(this.state.id)}>{this.state.title}</a></h5>
            <b> {this.state.provider} </b>
            <p className="card-text"> {this.state.description} </p>
          </div>
          <div className="card-footer">
            <small className="text-muted">Posted : <b>{this.state.datePosted}</b></small>
            <br />
            <div className="deal-strike-through">${this.state.originalPrice}</div>
            &nbsp;&nbsp;&nbsp;
            <div className="deal-notstrike-through" style={discountedPrice}>${this.state.discountedPrice}</div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <i>&#128077;+{this.state.thumbsUp}</i>
            &nbsp;&nbsp;&nbsp;
            <i>👎 +{this.state.thumbsDown}</i>
          </div>
        </div>
      </div>
    );
  }
}

export default CHDealsCard;