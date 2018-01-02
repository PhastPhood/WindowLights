import * as React from 'react';
import * as Modal from "react-modal";
import axios from 'axios';

interface TextButtonProps {
  phoneNumber: string;
}

interface TextButtonState {
  showModal: boolean;
  textValue: string;
}

export default class TextButton extends React.Component<TextButtonProps, TextButtonState> {
  constructor(props) {
    super(props);
    this.state = { showModal: false, textValue: '' };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSendText = this.handleSendText.bind(this);
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleTextChange(event) {
    this.setState({ textValue: event.target.value });
  }

  handleSendText(event) {
    if (this.state.textValue.trim().length === 0) {
      this.handleCloseModal();
    } else {
      axios.post('/api/sendtext', { phoneNumber: this.props.phoneNumber, message: this.state.textValue })
        .then(() => this.handleCloseModal())
        .catch(err => {
          alert('shit the text didn\'t send');
        });
    }
    event.preventDefault();
  }

  render() {
    return (
      <>
        <button className="TextButton" onClick={ this.handleOpenModal }>
          Text
        </button>
        <Modal
            isOpen={ this.state.showModal }
            onRequestClose = { this.handleOpenModal }
            className="TextButton__Modal"
            overlayClassName="TextButton__ModalOverlay">
          <span className="TextButton__ModalTitle">Text to { this.props.phoneNumber }</span>
          <form onSubmit={ this.handleSendText }>
            <textarea
                className="TextButton__ModalInputArea"
                value={ this.state.textValue }
                onChange={ this.handleTextChange }/>
            <div className="TextButton__ModalButtonContainer">
              <button
                  type="button"
                  className="TextButton__ModalButton TextButton__ModalButton--Close"
                  onClick={ this.handleCloseModal }>
                Close
              </button>
              <button type="submit" className="TextButton__ModalButton">
                Send text
              </button>
            </div>
          </form>
        </Modal>
      </>
    );
  }
}
