import React, { Component } from 'react';
import { Button,Form,FormControl,FormGroup,Col,ControlLabel } from 'react-bootstrap'
import {LineChart,XAxis,YAxis,CartesianGrid,Line} from 'recharts'
import MathJax from 'react-mathjax-preview'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Bacteria/>
      </div>
    );
  }
}

class Bacteria extends Component {
  constructor(props) {
    super(props)
    this.state = { 
        seconds: 0,
        initialP: 10,
        population: 10,
        populationO: [],
        growth:0.5,
        maxTime: 10,
        running: false,
        math: `$$P = P_0\e ^{t*r}$$`
    }
  }
  tick() {
    console.log(this.state);
    
    if (this.state.seconds === this.state.maxTime) {
      clearInterval(this.interval)
    }
    else {
      this.setState(prevState => ({
        seconds: prevState.seconds + 1
      }))
      this.setState(p => ({
        population: p.initialP*Math.exp(p.seconds*p.growth),
        populationO:[ ...p.populationO, 
          {name: p.seconds, Population: p.population }]
      }))
    }
  }

  start() {
    this.setState({running: true})
    this.interval = setInterval(() => this.tick(), 1000)
    this.setState({math: `$$P = ${this.state.initialP}e ^{t*${this.state.growth}}$$`})
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render () {
    return (
      <div>
        <h2>Bacterial growth</h2>
        <fieldset disabled={this.state.running}>
        <Form horizontal>
          <FormGroup controlId="formPopulation">
            <Col componentClass={ControlLabel} sm={2}>
              Initial population
            </Col>
            <Col sm={10}>
              <FormControl type="number" onBlur={e => this.setState({initialP: Number(e.target.value),population: Number(e.target.value)})}/>
            </Col>
          </FormGroup>
          <FormGroup controlId="formTime">
            <Col componentClass={ControlLabel} sm={2}>
              Maximal time
            </Col>
            <Col sm={10}>
              <FormControl type="number" onBlur={e => this.setState({maxTime: Number(e.target.value)})}/>
            </Col>
          </FormGroup>
          <FormGroup controlId="formRate">
            <Col componentClass={ControlLabel} sm={2}>
              Growth rate
            </Col>
            <Col sm={10}>
              <FormControl type="number" onBlur={e => this.setState({growth: Number(e.target.value)})}/>
            </Col>
          </FormGroup>
        </Form>
          <Button 
              bsStyle="primary"
              onClick={this.start.bind(this)}>
              Start
          </Button>
        </fieldset>
        <MathJax math={this.state.math} />
        <LineChart width={500} height={300} data={this.state.populationO}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
          <Line type="monotone" dataKey="Population" stroke="#8884d8" isAnimationActive={false} animationDuration={50} />
        </LineChart>
      </div>
    );
  }
}

export default App;
