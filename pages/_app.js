import {useState, useEffect} from 'react'
import {connect, JSONCodec} from '../node_modules/nats.ws/lib/src/mod.js'
import Messages from './Messages';
import moment from 'moment';
const jc = JSONCodec();

import '../styles/globals.css'

function App() {

  //refer to useState hook react documentation
  const [nc, setConnection] = useState(undefined);
  const [lastError, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setMessageText] = useState('');

  //update state when input changes
  const handleTextInput = (e) => {
    setMessageText(e.target.value);
  }

  //add a new message
  const addMessage = (err, msg) => {
    const incomingMsg = jc.decode(msg.data);
    incomingMsg.time = moment().format('YYYY-MM-DD HH:mm:ss');
    setMessages(messages => [...messages, incomingMsg]);
  }

  //send a message if there is content
  const sendMessage = async (err, msg) => {
    if(currentMessage){
      nc.publish('chatChannel', jc.encode({text: currentMessage, user: 'Joe'}));
      setMessageText('');
    }
  }

  //use effect hook to instantiate the nats connection
  useEffect(() => {
    if (nc === undefined) {
      connect({servers: ['wss://natsdemo.voxo.co:443'], waitOnFirstConnect: true})
        .then((nc) => {
          setConnection(nc);
          nc.subscribe('chatChannel', {callback: addMessage})
        })
        .catch((err) => {
          setError('error connecting to NATS');
          console.log(err);
        })
    }
  })

  const state = nc ? 'Connected to NATS' : 'Not connected to NATS';

  return (
    <div className="container">
      <h1 className="header">{state}</h1>
      <input
        type="text"
        placeholder="Type message"
        value={currentMessage}
        onChange={handleTextInput}
      />
      <button onClick={sendMessage}>Send Message</button>
      <h3>{lastError ? lastError : ''}</h3>
      {
        messages.length > 0 && lastError === ''
          ? (<Messages messages={messages}/>)
          : ('No Messages')
      }
    </div>
  );
}


export default App;
