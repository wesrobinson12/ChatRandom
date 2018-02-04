import React from 'react';
import injectSheet from 'react-jss';
import superagent from 'superagent';
import { connect } from 'react-redux';
import _ from 'lodash';
import io from "socket.io-client";
import classnames from 'classnames';
import ReactDOM from 'react-dom';

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textInput: '',
      messages: [],
      guest: 'Guest',
      roomName: null,
      waiting: true,
      pastRooms: []
    };

    this.socket = io('localhost:3000');
    let that = this;
    this.socket.on('ROOM_JOINED', (roomData) => this.joinRoom(roomData));
    this.socket.on('USER_LEFT', (roomData) => this.checkRoomStatus(roomData));
    this.socket.on('RECEIVE_MESSAGE', function(data) {
      that.addMessage(data);
    });

    this.onChange = this.onChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.joinNewRoom = this.joinNewRoom.bind(this);
    this.checkRoomStatus = this.checkRoomStatus.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
    this.renderWaiting = this.renderWaiting.bind(this);
  }

  componentDidMount() {
    let { sessionUser, history } = this.props;
    if (!sessionUser) history.push('/login');

    this.socket.emit('USER_CONNECTED', {
      user: sessionUser
    });
  }

  componentDidUpdate() {
    var node = ReactDOM.findDOMNode(this.refs.chatBox);

    if (node) node.scrollTop = node.scrollHeight;
  }

  checkRoomStatus(roomData) {
    let { roomName } = this.state;

    if (roomName !== null && roomData.room === roomName) {
      this.setState({ waiting: true, messages: [] });
    }
  }

  joinRoom(room) {
    let { roomName, waiting } = this.state;
    let { sessionUser } = this.props;

    let guest = room.users ?
      room.users.filter((name) => name !== sessionUser)[0] : 'Guest';
    if (!roomName) {
      if (room.new === true) {
        this.setState({ roomName: room.name, waiting: true });
      } else {
        this.setState({ roomName: room.name, waiting: false, guest });
      }
    } else if (waiting && roomName === room.name) {
      this.setState({ waiting: false, guest });
    }
  }

  joinNewRoom() {
    let { roomName, pastRooms } = this.state;
    let { sessionUser } = this.props;

    let newPastRooms = _.clone(pastRooms);
    newPastRooms.push(roomName);

    this.setState({ roomName: null, pastRooms: newPastRooms, messages: [] }, () => {
      this.socket.emit('JOIN_NEW_ROOM', {
        currentRoom: roomName,
        pastRooms: newPastRooms,
        user: sessionUser
      });
    });
  }

  addMessage(data) {
    let { messages } = this.state;

    let newMessageList = _.clone(messages);
    newMessageList.push(data);

    this.setState({ messages: newMessageList });
  }

  sendMessage(e) {
    let { textInput } = this.state;
    e.preventDefault();

    if (textInput.startsWith('/delay')) {
      let splitText = textInput.split(' ');
      let delayAmt = splitText[1];
      let sendText = splitText.slice(2).join(' ');

      setTimeout(() => this.emitMessage(sendText), delayAmt);
    } else if (textInput.startsWith('/hop')) {
      this.joinNewRoom();
    } else if (textInput.startsWith('/')) {

    } else {
      this.emitMessage(textInput);
    }


    this.setState({ textInput: '' });
  }

  emitMessage(sendText) {
    let { sessionUser } = this.props;
    let { roomName } = this.state;

    this.socket.emit('SEND_MESSAGE', {
      user: sessionUser,
      message: sendText,
      room: roomName
    });
  }

  onChange(e) {
    this.setState({ textInput: e.currentTarget.value });
  }

  renderMessages() {
    let { messages } = this.state;
    let { classes, sessionUser } = this.props;

    return messages.map((message, idx) => {
      let chatClass = message.user === sessionUser ?
        classnames(classes.chatBubble, classes.userBubble) :
        classnames(classes.chatBubble, classes.guestBubble);
      return (
        <div key={message.user + idx} style={{display: 'block'}} className={classes.clearFix}>
          <div className={chatClass}>{message.message}</div>
        </div>
      );
    });
  }

  renderWaiting() {
    let { classes } = this.props;
    return (
      <div className={classes.chatContainer}>
        <div className={classes.waiting}>Waiting for another user to join...</div>
      </div>
    );
  }

  render() {
    let { classes, sessionUser } = this.props;
    let { textInput, waiting, guest } = this.state;

    if (waiting) {
      return(this.renderWaiting());
    } else {
      return (
        <div className={classes.chatContainer}>
          <div className={classes.chattingWith}>
            Chatting with <span className={classes.guestName}>{guest}</span>
          </div>
          <div className={classes.chatBox} ref='chatBox'>
            {this.renderMessages()}
          </div>
          <form onSubmit={this.sendMessage}>
            <input
              type='text'
              value={textInput}
              placeholder='Drop a line!'
              onChange={this.onChange}
              className={classes.inputBox}>
            </input>
          </form>
        </div>
      );
    }
  }
}

const styles = {
  chatContainer: {
    marginTop: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  waiting: {
    fontSize: '30px',
    color: ''
  },
  chatBox: {
    width: '650px',
    height: '400px',
    borderRadius: '8px',
    background: '#fff',
    marginBottom: '10px',
    border: '1px solid #ccc',
    overflowY: 'auto'
  },
  inputBox: {
    height: '40px',
    width: '630px',
    borderRadius: '8px',
    background: '#fff',
    color: '#474d59',
    padding: '10px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  chatBubble: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '3px',
    margin: '10px'
  },
  userBubble: {
    float: 'right',
    background: '#d5e0f8',
  },
  guestBubble: {
    float: 'left',
    background: '#9bf5c7'
  },
  chattingWith: {
    marginBottom: '20px',
    fontSize: '24px',
  },
  guestName: {
    color: '#006df0'
  },
  clearFix: {
    '&:after': {
      content: '""',
      display: 'block',
      clear: 'both'
    }
  }
};

const mapStateToProps = (state) => ({
  sessionUser: state.chat.sessionUser
});

export default connect(
  mapStateToProps
)(injectSheet(styles)(Chat));
