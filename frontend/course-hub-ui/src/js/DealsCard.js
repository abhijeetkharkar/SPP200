import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import '../css/card.css';


class DealsCard extends React.Component {
  state = { expanded: false };

  render() {
    const { classes } = this.props;
    var customStyle = {
      'text-align': 'left'
    };

    return (
      <div style={customStyle}>
        <div class="card">
          <img class="card-img-top" src="https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2F276*180px.svg?alt=media&token=0d8e5d9d-9087-4135-944b-fe9b87b96fb0" alt="Card image cap" />
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <b> Provider: </b>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          </div>
          <div class="card-footer">
            <small class="text-muted">Last updated 3 mins ago</small>
          </div>
        </div>
      </div>
    );
  }
}

export default DealsCard;