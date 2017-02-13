import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Client from '../Client';
const Recharts = require('recharts');
const {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;

const Chart = React.createClass({
  render () {
    return (
      <LineChart width={600} height={300} data={this.props.data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
         <XAxis dataKey="name"/>
         <YAxis/>
         <CartesianGrid strokeDasharray="3 3"/>
         <Tooltip/>
         <Legend />
         {this.props.names.map(function(name, i){
          return <Line type="monotone" dataKey={name} stroke={"#"+((1<<24)*Math.random()|0).toString(16)} key={i}/>
         })}
         
      </LineChart>
    );
  }
});

class Index extends Component {

	constructor(props){
		super(props);
		this.state = {stockNames: ['AMZN', 'AAPL', 'GOOG'], stocks: []};
	}
	
	componentDidMount(){
	  let objects = [];
	  this.state.stockNames.map( (name) => {
	    Client.get('/api/stock/' + name, (res) => {
	      res.map( (x, index) => {
	        
          if(x[0] !== ''){
            if(!objects[index]) objects[index] = {};
  	        objects[index]['name'] = x[0];
  	        objects[index][name] = Number(x[1]);
          }
        });
	      this.setState({stocks: JSON.parse(JSON.stringify(objects))});
	    });
	  });
	}

  render(){
     const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    ];
    return (
    	<div>
    		{this.state.stockNames.map( (stock, i) => {
    			return <h1 key={i}>{stock}</h1>;
    		})}
        <Chart data={this.state.stocks} names={this.state.stockNames}/>
      </div>
    );
  }
}

ReactDOM.render(<Index name='World'/>, document.getElementById('root'));