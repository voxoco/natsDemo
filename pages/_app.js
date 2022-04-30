import {useState, useEffect} from 'react'
import {connect, StringCodec} from '../node_modules/nats.ws/lib/src/mod.js'
import Messages from './Messages';
import '../styles/globals.css'
const sc = StringCodec();

function App() {
  const [nc, setConnection] = useState(undefined);
  const [lastError, setError] = useState('');
  const [messages, setMessages] = useState([]);

  let key =0;
  const addMessage = (err, msg) => {
    key++;
    msg.key = key;
    const {subject, reply} = msg;
    const data = sc.decode(msg.data);
    const m = {subject, reply, data, key, time: new Date().toUTCString()};
    messages.unshift(m);
    const a = messages.slice(0, 10);
    setMessages(a);
    console.log(msg.subject);
  }

  const sendMessage = async (err, msg) => {
    nc.publish('joeChannel', sc.encode('test'));
  }

  useEffect(() => {
    if (nc === undefined) {

      connect({servers: ['wss://natsdemo.voxo.co:443'], waitOnFirstConnect: true})
      .then((nc) => {
        setConnection(nc);
        nc.subscribe('joeChannel', {callback: addMessage})
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
      <button onClick={sendMessage}>Send Message</button>
      <h3>{lastError ? lastError : ''}</h3>
      {messages.length > 0 && lastError === '' ? (<Messages messages={messages}/>) : ('No Messages')}
    </div>
  );
}



export default App;
