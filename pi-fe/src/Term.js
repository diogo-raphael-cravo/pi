import React, { Component } from 'react';

function copy(id) {
  console.log(id)
  const copyText = document.getElementById(id);
  copyText.select();
  document.execCommand("copy");
}

class Term extends Component {
  render() {
    return (
      <div>
        <button 
          onClick={() => copy(this.props.id)}
          style={{marginRight: 5}}>
          copy
        </button>
        <input 
          size='50' 
          readOnly={true} 
          style={{border: 0}} 
          type='text' 
          value={this.props.term} 
          id={this.props.id}
        />
      </div>);
  }
}

export default Term;