import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Client from '../Client';
import io from 'socket.io-client';
const Recharts = require('recharts');
const {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} = Recharts;

const randomColor = require('randomcolor');

const Chart = React.createClass({
  
  render () {
    const colors = randomColor({
        count: this.props.names.length,
        luminosity: 'bright',
        hue: 'random'
    });
    return (
      <div>
        <h1 className='title'>Stocks</h1>
        <LineChart width={1400} height={300} data={this.props.data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
           <XAxis dataKey="name" interval={10}/>
           <YAxis/>
           <Tooltip labelStyle={{color: 'black'}}/>
           <Legend />
           {this.props.names.map(function(name, i){
            return <Line type="monotone" dataKey={name} stroke={colors[i]} key={i} dot={false}/>
           })}
           
        </LineChart>
      </div>
    );
  }
});

class Index extends Component {

	constructor(props){
		super(props);
		this.state = {stockNames: [], stocks: [], socket: io(), newStock: ''};
	}
	
	componentDidMount(){
	  this.state.socket.on('change', () => {
      Client.get('/api/stocks', (res) => {
        this.setState({stockNames: res});
        this.setStocks();
      });
    });
    this.state.socket.emit('change');
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

  deleteStock(stock){
    const t = this;
    Client.del('/api/deletestock', {stock: stock}, (res) => {
      t.state.socket.emit('change');
    })
  }

  changeInput(event) {
    this.setState({newStock: event.target.value});
  }

  submitStock(e){
    e.preventDefault();
    if(this.state.newStock !== ""){
      this.setState({newStock: ''})
      Client.post('/api/newstock/', {stock: this.state.newStock}, (res) => {
        if(res){
          this.state.socket.emit('change');
        }
        else{
          alert('Not a valid stock');
        }
      });
    }
  }

  focus(){
    this.stockInput.focus();
  }

  render(){
    return (
    	<div>
        <Chart data={this.state.stocks} names={this.state.stockNames}/>
        <div className='row-wrap'>
          {this.state.stockNames.map( (stock, i) => {
            return (
              <div key={i} onClick={this.deleteStock.bind(this, stock)} className='stock'>
                <span className='name'>{stock}</span>
                <span className='delete'>X</span>
              </div>
            )
          })}
          <div className='stock' id='input-stock' onClick={this.focus.bind(this)}>
            <form onSubmit={this.submitStock.bind(this)}>
              <input placeholder='New Stock' value={this.state.newStock} onChange={this.changeInput.bind(this)} ref={(input) => { this.stockInput = input; }} ></input>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Index name='World'/>, document.getElementById('root'));