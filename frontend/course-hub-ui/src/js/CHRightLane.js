import React, { Component } from 'react';
import '../css/bootstrap.min.css';
import '../css/common-components.css';

class CHRightLane extends Component {

    constructor(props) {
        console.log("CHRightLane, Constructor");
        super(props);
        this.state = {
          teamList: [],
          playerList: [],
          topTenPlayers: []
        }
    }

    componentWillMount() {
        console.log("CHRightLane, componentWillMount");
        this.getTeams();
        this.getTopTenPlayers();
        //this.getPlayers();
    }

    getTeams() {
        const self = this;
        console.log("CHRightLane, getTeams");
        const teamsOpenDota = `https://api.opendota.com/api/teams`;
        fetch(teamsOpenDota).then(function (response) {
            return response.json();
        }).then(function (teams) {
            console.log(teams.slice(0, 10));
            self.setState({
                teamList: teams.slice(0, 10)
            });
        }).catch(function(error) {
            console.log('Request failed due to ', error)
        });
    }

    getPlayers() {
        const self = this;
        //console.log("CHRightLane, getPlayers");
        const playersOpenDota = `https://api.opendota.com/api/teams`;
        fetch(playersOpenDota).then(function (response) {
            return response.json();
        }).then(function (players) {
            console.log(players.slice(0, 10));
            self.setState({
                playerList: players.slice(0, 10)
            });
        }).catch(function(error) {
            console.log('Request failed due to ', error)
        });
    }

    getTopTenPlayers() {
        const self = this
        fetch("https://api.opendota.com/api/rankings").then(function (response) {
            return response.json()
        }).then(function(topPlayerStats) {
            console.log(topPlayerStats);
            var rankings = []
            for (var i = 0; i < 10; i++) {
                var player = topPlayerStats.rankings[i].personaname
                var rating = topPlayerStats.rankings[i].score
                rankings.push([player,rating])
            }
            console.log(rankings)
            self.setState({
                topTenPlayers: rankings
            })
        })
    }

    render() {
        //console.log("Height",window.innerHeight)
        var customStyle = {
            height: "75vh"
        }

        const teamRows = this.state.teamList.map((team) =>
            <tr key={team.team_id}>
                <td className = "td-left team-logo" style={{background: "url("+team.logo_url+")"}}></td>
                <td>{team.name}</td>
                <td>{team.rating}</td>
            </tr>
        );

        const topTenPlayers = this.state.topTenPlayers.map((player) =>
            <tr key={player[0]}>
                <td className = "td-left">{player[0]}</td>
                <td>{player[1]}</td>
            </tr>
        )
        console.log(this.state.topTenPlayers)

        return (
            <div className="right-lane" style={customStyle}>
                <div className="my-right-lane-title">
                    <h6>Top 10 Teams</h6>
                    <table className = "my-table table table-hover">
                        <thead>
                            <tr>
                                <th className = "th-left">Logo</th>
                                <th>Team</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody style = {{textAlign:"left"}}>
                            {teamRows}
                        </tbody>
                    </table>
                    <h6>Top 10 Players</h6>
                    <table className = "my-table table table-hover">
                        <thead>
                            <tr>
                                <th className = "th-left">Player</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody style = {{textAlign:"left"}}>



                            {topTenPlayers}

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
 }

export default CHRightLane;
