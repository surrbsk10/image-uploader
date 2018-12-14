import React, { Component } from 'react';
import './App.css';

const styles = {
  col1: {
    width: '5%'
  },
  col2: {
    width: '30%'
  },
  col3: {
    width: '65%'
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      fileNames: [],
      files:  null
    };

    this.handleFiles = this.handleFiles.bind(this);
    this.renderProgressTable = this.renderProgressTable.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  handleFiles({ target }) {
    console.log(target);
    if(target.files.length > 0) {
      let fileNames = Array.from(target.files).map(file => file.name);
      this.setState({ fileNames, files: target.files });
    }
  }

  uploadFiles() {
    let { files } = this.state;
    let xhr = new XMLHttpRequest();
  }

  shorten(str) {
    if(str.length > 15) {
      return str.slice(0, 13) + '..';
    }
    return str;
  }

  renderProgressTable() {
    return (
      <table>
        <tbody>
          {
            this.state.fileNames.map((name, index) => (
              <tr key={index}>
                <td style={styles.col1}>{ index + 1 }</td>
                <td style={styles.col2}>{ this.shorten(name) }</td>
                <td style={styles.col3} className='ProgressBar'></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className='App'>
        <div className='Left'>
          <div className='Top'>
            <h3>Upload Image(s)</h3>
              <form>
                <input type='file' multiple onChange={this.handleFiles} />
                <input type="button" name="upload" value= "upload" />
              </form>
          </div>
          <div className='Bottom'>
            <h3>Upload Progress</h3>
            { this.renderProgressTable() }
          </div>
        </div>
        <div className='Divider'>

        </div>

        <div className='Right'>

        </div>
      </div>
    );
  }
}

export default App;
