import React, { Component } from 'react';
import AdSense from 'react-adsense';
import '../css/bootstrap.min.css';
import '../css/common-components.css';

class CHAdvertisements extends Component {

    constructor(props) {
        super(props);
        this.state = {
            teamList: [],
            playerList: [],
            topTenPlayers: []
        }
    }

    render() {

        return (
            <div className="search-results-advertisements-div">
                <AdSense.Google
                    client={process.env.REACT_APP_SEARCH_EP}
                    slot='7806394673'
                    style={{ display: 'block' }}
                    format='auto'
                    responsive='true'
                />
            </div>
        );
    }
}

export default CHAdvertisements;
