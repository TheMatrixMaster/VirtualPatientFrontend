import React, { Component } from 'react';
import logo from './head_rig.gif';
import still from './still.PNG';
import gcp from './gcp.jpeg';
import './App.css';


const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button className="btn btn-primary btn-raised center" onClick={handleClose}>close</button>
      </section>
    </div>
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.speech_to_text_api = "http://localhost:5000/api/speech_to_text";
    this.text_to_speech_api = "http://localhost:5000/api/text_to_speech";

    this.state = {
      client_text: "",
      server_text: "",
      num_requests: 10,
      img: still,
      once: true,
      show: false,
      my_questions: [],
      my_answers: [],
      my_intents: []
    };
  }

  componentDidMount() {
    window.addEventListener("keydown", event => {
      if (event.keyCode === 32 && this.state.once === true) {
        this.speech_to_text();
        this.setState({ once: false });
      }
    });
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  speech_to_text() {
    fetch(this.speech_to_text_api)
      .then(res => res.json())
      .then(result => {
        console.log(result.msg);
        this.setState({ client_text: result.msg });
        var joined = this.state.my_questions.concat(result.msg);
        this.setState({ my_questions: joined });
        this.setState({ img: logo });
        this.text_to_speech(result.msg);
        this.setState({ num_requests: this.state.num_requests - result.counter })
      })
  }

  text_to_speech(client_text) {
    let url = this.text_to_speech_api + '/' + client_text
    fetch(url)
      .then(res => res.json())
      .then(result => {
        console.log(result.msg);
        this.setState({ server_text: result.msg });

        var joined = this.state.my_answers.concat(result.msg);
        this.setState({ my_answers: joined });

        var intents = this.state.my_intents.concat(result.intent)
        this.setState({ my_intents: intents })

        this.setState({ img: still });
      })
    this.setState({ once: true });
  }

  create_report() {

  }

  render() {
    return (
      <div className="App">
        <div className="box">
          <h5 className="instructions">Press and hold the spacebar to speak.</h5>
          <h5 className="instructions">Press the button below to input diagnosis and get results.</h5>
        </div>

        <div className="input-group mb-3 diag">
          <select className="custom-select" id="inputGroupSelect02">
            <option>Choose...</option>
            <option>Lower Abdomen</option>
            <option>Higher Abdomen</option>
            <option>Appendicitis</option>
          </select>
          <button type="button" onClick={this.showModal} className="btn btn-success btn-raised button">Submit Diagnosis</button>
        </div>

        <Modal show={this.state.show} handleClose={this.hideModal}>
          <h2 className="title">This is your report</h2>
          <div className="diagnosis-result">
            {this.state.diagnosis_result}
          </div>
          <div className="optimal-progression">
            {}
          </div>
          <div className="your-progression">
            {}
          </div>
          <div className="sentiment-analysis">
            {}
          </div>
          <div className="final-score">
            {}
          </div>
        </Modal>

        <h3 className="caption">Powered by</h3>
        <img src={gcp} className="gcp" alt="logo" />
        <header className="App-header">
          <img src={this.state.img} className="App-logo" alt="logo" />
        </header>
        <body className="App-body">
          <div className="Doctor-Box">
            <h2>Doctor Prompt</h2>
            <h5 className="Client-Text">{this.state.client_text}</h5>
          </div>
          <div className="Patient-Box">
            <h2>Patient Prompt</h2>
            <h5 className="Server-Text">{this.state.server_text}</h5>
          </div>
        </body>
      </div>
    );
  }
}




export default App;
