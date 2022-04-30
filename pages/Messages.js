import Message from './Message';
const Messages = ({ messages }) => {
  return (
    <>
      {messages.map((m, index) => (
        <Message key={index} msg={m} />
      ))}
    </>
  )
}

export default Messages
