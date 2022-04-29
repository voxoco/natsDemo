class App extends Component {
  constructor(props) {
    super(props);
    this.server = 'wss://natsdemo.voxo.co:443';
    this.doConnect();
  }

  doConnect() {
    connect({servers: [this.server]})
      .then((nc) => {
        this.nc = nc;
        this.nc.jetstreamManager()
          .then((jsm) => {
            this.jsm = jsm;
            console.info(`connected jsm`);
            this.jsm.streams.add({name: "my", subjects: ["my.>"]})
              .then((info) => {
                console.info(info);
              })
          })
          .catch((err) => {
            console.error(`failed to connect to jetstream: ${err}`);
          })
      })
      .catch((err) => {
        console.error(`failed to connect: ${err}`);
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Hello NATS.ws!!!
        </header>
      </div>
    );
  }
}