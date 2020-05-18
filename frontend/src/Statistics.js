import React from "react";
import MenuButton from "./MenuButton";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import Menu from "./Menu";

class Statistics extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            stats1: [],
            stats2: []
        };
        this.getStats();
    }

    async getStats() {
        try {
            let res = await fetch('/statistics', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            let result = await res.json();
            if(result && result.success) {
                if(result.onlyOne){
                    this.setState({
                        stats1: result.stats1
                    })
                } else {
                    this.setState({
                        stats1: result.stats1,
                        stats2: result.stats2
                    })
                }
            } else if(result && result.success === false) {
                alert(result.msg);
            }
        } catch(e) {
            console.log(e);
        }
    }

    matchesHistory() {
        if(this.state.stats2.length > 0) {
            let table = [];

            for (let i = 0; i < this.state.stats2.length; i++) {
                let children = [];

                children.push(<td>{this.state.stats2[i].pocet_hr}</td>);
                children.push(<td>{this.state.stats2[i].prve_m}</td>);
                children.push(<td>{this.state.stats2[i].druhe_m}</td>);
                children.push(<td>{this.state.stats2[i].tretie_m}</td>);
                children.push(<td>{this.state.stats2[i].stvrte_m}</td>);

                table.push(<tr>{children}</tr>);
            }
            return table;
        } else {
            return <tr><td colSpan="5">You didn't play any matches</td></tr>
        }
    }

    render() {
        return (
            <Router>
                <Route path="/statistics" exact render={() => {
                    return (
                        <div className="statistics">
                            <div className="statsForm">
                                <div className="row-twoPG">
                                    <table>
                                        <caption>Two Player Game</caption>
                                        <tr>
                                            <th id="th1">1. place</th>
                                            <th id="th2">2. place</th>
                                        </tr>
                                        <tr>
                                            <td>{this.state.stats1.h2_1_}</td>
                                            <td>{this.state.stats1.h2_2_}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div className="row-threePG">
                                    <table>
                                        <caption>Three Player Game</caption>
                                        <tr>
                                            <th id="th1">1. place</th>
                                            <th id="th2">2. place</th>
                                            <th id="th3">3. place</th>
                                        </tr>
                                        <tr>
                                            <td>{this.state.stats1.h3_1_}</td>
                                            <td>{this.state.stats1.h3_2_}</td>
                                            <td>{this.state.stats1.h3_3_}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div className="row-fourPG">
                                    <table>
                                        <caption>Four Player Game</caption>
                                        <tr>
                                            <th id="th1">1. place</th>
                                            <th id="th2">2. place</th>
                                            <th id="th3">3. place</th>
                                            <th id="th4">4. place</th>
                                        </tr>
                                        <tr>
                                            <td>{this.state.stats1.h4_1_}</td>
                                            <td>{this.state.stats1.h4_2_}</td>
                                            <td>{this.state.stats1.h4_3_}</td>
                                            <td>{this.state.stats1.h4_4_}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div className="row-matchesH">
                                    <table>
                                        <caption>Matches History</caption>
                                        <tr>
                                            <th>Num. of players</th>
                                            <th id="th1">1. place</th>
                                            <th id="th2">2. place</th>
                                            <th id="th3">3. place</th>
                                            <th id="th4">4. place</th>
                                        </tr>
                                        {this.matchesHistory()}
                                    </table>
                                </div>
                            </div>
                            <div className="backBtn">
                                <Link to='/'>
                                    <MenuButton
                                        text = {'Back'}
                                        disabled={false}
                                    />
                                </Link>
                            </div>
                        </div>
                    );
                }}/>
                <Switch>
                    <Route exact path="/" component={Menu} />
                </Switch>
            </Router>
        );
    }
}

export default Statistics;