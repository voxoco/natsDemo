const Message = ({ msg }) => {
  return (
    <div className={`message ${msg.reply ? 'request': ''}`}>
      <h3>{msg.user}</h3>
      <p>{msg.text}</p>
      <small>{msg.time}</small>
    </div>
  )
}

export default Message
