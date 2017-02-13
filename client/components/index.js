import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Client from '../Client';
const Recharts = require('recharts');
const {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;

const Chart = React.createClass({
  render () {
    return (
      <LineChart width={1400} height={300} data={this.props.data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
         <XAxis dataKey="name" interval={10}/>
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
		this.state = {stockNames: [], stocks: []};
	}
	
	componentDidMount(){
	  
    Client.get('/api/stocks', (res) => {
      this.setState({stockNames: res});
      this.setStocks();
    });
	}

  setStocks(){
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

  add(){
    var name = prompt();
    if(name !== ""){
      Client.post('/api/newstock/', {stock: name}, (res) => {
        if(res){
          this.setState({stockNames: res});
          this.setStocks();
        }
      });
    }
  }

  deleteStock(stock){
    const t = this;
    Client.del('/api/deletestock', {stock: stock}, (res) => {
      t.setState({stockNames: res});
      t.setStocks();
    })
  }

  render(){
    return (
    	<div>
    		{this.state.stockNames.map( (stock, i) => {
    			return <h1 key={i} onClick={this.deleteStock.bind(this, stock)}>{stock}</h1>;
    		})}
        <Chart data={this.state.stocks} names={this.state.stockNames}/>

        <button onClick={this.add.bind(this)}>Add</button>
      </div>
    );
  }
}

ReactDOM.render(<Index name='World'/>, document.getElementById('root'));