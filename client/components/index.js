import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Client from '../Client';
const Recharts = require('recharts');
const {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;

class Index extends Component {

	constructor(props){
		super(props);
		this.state = {stockNames: ['AMZN', 'AAPL'], stocks: []};
	}
	
	componentDidMount(){
	  let objects = [];
	  this.state.stockNames.map( (name) => {
	    Client.get('/api/stock/' + name, (res) => {
	      res.map( (x, index) => {
	        if(!objects[index]){objects[index] = {};}
	        objects[index]['name'] = x[0];
	        objects[index][name] = x[1];
        });
	      this.setState({stocks: objects});
	    });
	  });
	}

  render(){
    return (
    	<div>
    		{this.state.stockNames.map( (stock, i) => {
    			return <h1 key={i}>{stock}</h1>;
    		})}
    		<LineChart width={800} height={300} data={this.state.stocks}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend />
          <Line type="monotone" dataKey="AAPL" stroke="#000" />
          <Line type="monotone" dataKey="AMZN" stroke="#000" />
        </LineChart>
      </div>
    );
  }
}

ReactDOM.render(<Index name='World'/>, document.getElementById('root'));