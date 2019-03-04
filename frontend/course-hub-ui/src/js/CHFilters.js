import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/common-components.css';
// import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';


class CHFilters extends Component {
    render() {
        console.log("Height",window.innerHeight)
        var customStyle = {
            height: "75vh"
        }
        return (
            <div className="left-lane" style={customStyle}>
                <div className="my-left-lane-title">
                    <h6>Search Options</h6>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" id="usr"/><br/>
                    <input className="my-input-alignment" type="radio" name="searchChoice" id="player"/>
                    <label className="my-label-alignment" htmlFor="player">Player</label>
                    <input className="my-input-alignment" type="radio" name="searchChoice" id="team"/>
                    <label className="my-label-alignment" htmlFor="team">Team</label>
                    <input className="my-input-alignment" type="radio" name="searchChoice" id="match"/>
                    <label className="my-label-alignment" htmlFor="match">Match</label><br/>
                    <div style={{textAlign:"center"}}>
                        <button type="button" className="btn btn-info my-button-alignment">Search</button>
                    </div>
                </div>
                {/* <TwitterTimelineEmbed
                    sourceType="profile"
                    screenName="DOTA2"
                    options={{height: 400}}
                    /> */}
            </div>
        );
    }
 }

export default CHFilters;
