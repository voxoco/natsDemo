const Message = ({ msg }) => {
  return (
    <div className={`message ${msg.reply ? 'request': ''}`}>
      <h3>{msg.subject}</h3>
      <p>{msg.data}</p>
      <small>{msg.time}</small>
    </div>
  )
}

export default Message