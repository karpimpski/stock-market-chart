import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Client from '../Client';

class Index extends Component {

	constructor(props){
		super(props);
		this.state = {stockNames: ['AMZN', 'AAPL'], stocks: []};
	}
	
	componentDidMount(){
	  let objects = [];
	  this.state.stockNames.map( (name) => {
	    Client.get('/api/stock/' + name, (res) => {
	      objects.push({name: name, history: res});
	      console.log(objects);
	      this.setState({stocks: objects});
	    });
	  });
	}

  render(){
    return (
    	<div>
    		{this.state.stocks.map( (stock, i) => {
    			return <h1 key={i}>{stock.name}</h1>;
    		})}
      </div>
    );
  }
}

ReactDOM.render(<Index name='World'/>, document.getElementById('root'));