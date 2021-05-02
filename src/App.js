import React from 'react';
import './App.css';
import ReactPaginate from 'react-paginate';

class App extends React.PureComponent {

  constructor(props) {
    super(props);
    const weekDays = {
    	1: 'Mon',
    	2: 'Tue',
    	3: 'Wed',
    	4: 'Thu',
    	5: 'Fri',
    	6: 'Sat',
    	7: 'Sun'
    };
    this.state = { 
    	            locations: [], 
    	            hoursById: [], 
    	            offset: 0, 
    	            perPage: 10, 
    	            currentPage: 0,
    	            weekDaysById: weekDays
    	        };
    	        this.handlePageClick = this
    	        .handlePageClick
    	        .bind(this);
  }
  
 componentDidMount() {
    this.getLocations();
  }

  getLocations() {
  	fetch('/locations')
  	.then(res => res.json())
  	.then((response) => {
  		const data = this.filterOutNonHelsinki(response.data.data);
    	this.handleLocationData(data);
    });
  }

handleLocationData(data) {
    const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
    const pageData = this.displayPageData(slice);
    this.setState({
    	pageCount: Math.ceil(data.length / this.state.perPage),
    	pageData
    });
}

displayPageData(slice) {


	const pageData = slice.map((item, i) => {


  	    const openingTimes = Object.keys(this.state.hoursById[item.id]).map((key, j) => {
  	    	if (!this.state.hoursById[item.id][key].opens || !this.state.hoursById[item.id][key].closes) {
  	    		return (
  	    			    <li key={j}>{ this.state.weekDaysById[key] + ': '} Closed</li> 
  	    			)
  	    	}
  		    return (
  		   	    <li key={j}>{this.state.weekDaysById[key] + ': '}  { this.state.hoursById[item.id][key].opens } - { this.state.hoursById[item.id][key].closes } </li>   	
  		    );
  	     });

        return (
            <div key={i}>
              <ul className="column-list">
                <h4>{ item.name.fi }</h4>
                  <li> { 'Address: ' +  item.location.address.street_address + ', ' + 
        	        item.location.address.postal_code + ' ' + 
        	        item.location.address.locality }
        	      </li>
        	      <h5>Opening Hours</h5>
        	        { openingTimes }
              </ul>
            </div>
        )
	});
    return pageData;
}

filterOutNonHelsinki(data) {
	data = data.filter(item => item.location.address.locality === 'Helsinki');
	const openingHoursById = this.parseOpeningHours(data);
	this.setState({ locations: data, hoursById: openingHoursById });
	return data;
}

// Kun vaihdetaan sivua;
handlePageClick = (e) => {
	const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
    	currentPage: selectedPage,
    	offset: offset
    }, () => {
    	this.handleLocationData(this.state.locations);
    });

}

parseOpeningHours(data) {
	const openingHoursById = {};
	data.forEach(item => {
		openingHoursById[item.id] = {}; 
		if (item.opening_hours.hours) {
		    item.opening_hours.hours.forEach(weekday => {
			    if (weekday.open24h) {
				    openingHoursById[item.id][weekday.weekday_id] = { open: true, opens: '00.00', closes: '23.59' };
			    } else {
			    	if (!weekday.opens && !weekday.closes) {
			    		openingHoursById[item.id][weekday.weekday_id] = { open: false };
			    	} else {
				    openingHoursById[item.id][weekday.weekday_id] = { opens: weekday.opens, closes: weekday.closes };
				}
			    }

		    });	
		}
	});
	return openingHoursById;
}

  render () {
    return (
      <div id="ListPlaces">
        <h1>Places of Helsinki</h1>
            {this.state.pageData}
                <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}/>
      </div>
      )
    }
}



export default App;