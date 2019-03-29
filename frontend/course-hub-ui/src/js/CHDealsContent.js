import React, { Component } from 'react';
import '../App.css';
import '../css/common-components.css';
import '../css/search.css';
import '../css/card.css';
import DealsCard from './DealsCard';
import CHDealsFilter from './CHDealsFilter';
import { Table, Image, Pagination } from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const fetch = require('node-fetch');


class CHDealsContent extends Component{
    constructor (props, context){
        super(props, context);
        this.state = {
            totalPages: 1,
            currentPage: 1,
            deals: [],
            pageList: []
        }
    }

    render() {
        return (
            <div className="my-content-landing">
                <div className="dealsPage">
                    <CHDealsFilter updateContent={this.handleClick} updateFilter={this.handleFilter} />,
                    <div className="deals-landing-1">
                        <DealsCard />
                    </div>,
                    <div className="deals-landing-2">
                        <DealsCard />
                    </div>,
                    <div className="deals-landing-3">
                        <DealsCard />
                    </div>,
                    <div className="deals-landing-4">
                        <DealsCard />
                    </div>,
                    <div className="deals-landing-5">
                        <DealsCard />
                    </div>,
                    <div className="deals-landing-6">
                        <DealsCard />
                    </div>,
                    <div className="deals-landing-7">
                        <DealsCard />
                    </div>,
                    <div className="deals-landing-8">
                        <DealsCard />
                    </div>,
                    <tfoot>
                        <tr>
                            <td colSpan="2" className="search-results-table-footer">
                                <Pagination className="search-results-table-footer-paginator">
                                    <Pagination.First id="search-results-table-footer-paginator-first" onClick={() => this.props.updatePage(this.props.searchString, 0)}/>
                                    {this.props.pageNumber <= 0 && <Pagination.Prev id="search-results-table-footer-paginator-prev"  disabled />}
                                    {this.props.pageNumber > 0 && <Pagination.Prev id="search-results-table-footer-paginator-prev"  onClick={() => this.props.updatePage(this.props.searchString, this.props.pageNumber-1)}/>}

                                    {
                                        this.state.pageList.map(page => {
                                            if(page === this.props.pageNumber)
                                                return <Pagination.Item key={page} id={"search-results-table-footer-paginator-item-" + page} active onClick={() => this.props.updatePage(this.props.searchString, page)}>{page+1}</Pagination.Item>;
                                            else
                                                return <Pagination.Item key={page} id={"search-results-table-footer-paginator-item-" + page} onClick={() => this.props.updatePage(this.props.searchString, page)}>{page+1}</Pagination.Item>;
                                        })
                                    }

                                    {this.props.pageNumber >= this.state.totalPages-1 && <Pagination.Next id="search-results-table-footer-paginator-next" disabled />}
                                    {this.props.pageNumber < this.state.totalPages-1 && <Pagination.Next id="search-results-table-footer-paginator-next" onClick={() => this.props.updatePage(this.props.searchString, this.props.pageNumber+1)}/>}
                                    <Pagination.Last id="search-results-table-footer-paginator-last" onClick={() => this.props.updatePage(this.props.searchString, this.state.totalPages-1)}/>
                                </Pagination>
                            </td>
                        </tr>
                    </tfoot>
                </div>
            </div>
        )
    }
}

export default CHDealsContent;