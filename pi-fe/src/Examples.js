import React, { Component } from 'react';
import Term from './Term';

const examples = [
  'y x.0 | y(z).0',
  '!y x.0 | y(z).0',
  '(x)y x.0 | y(x).0 + [x=y].0',
  '((x)(x(y).x(z).y z.0 | x(w).x(v).v w.0 | x a.x b.0))',
  '((x)(x(u).u(y).u(z).y z.0 | x(t).t(w).t(v).v w.0 | (s)x s.s a.s b.0))',
  '!((y)(x y.y y.0 + x(z).z(w).0))',
];

class Examples extends Component {
  constructor(props) {
    super(props);
    this.state = {hidden: true};

    this.toggleHide = this.toggleHide.bind(this);
  }

  toggleHide() {
    this.setState({hidden: !this.state.hidden});
  }

  render() {
    return (
      <div>
        <h2 onClick={() => this.toggleHide()}>Examples (click to {this.state.hidden? 'show' : 'hide'})</h2>
        <div style={this.state.hidden? {display:'none'} : {}}>
          <ul style={{listStyle: 'none', paddingLeft: 10}}>
            {examples.map((e, i) => {
              const id = `ex${i}`;
              return (<li key={id}>
                <Term id={id} term={e}/>
              </li>);
            })}
          </ul>
        </div>
      </div>);
  }
}

export default Examples;