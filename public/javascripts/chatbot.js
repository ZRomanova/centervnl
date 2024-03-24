const socket = io();
const inputMessage = document.getElementById('inputMessage');
const sendMessage = document.getElementById('sendMessage');
const messages = document.getElementById('messages');

sendMessage.addEventListener('click', () => {
  const message = inputMessage.value;
  socket.emit('message', message);
  inputMessage.value = '';
});

socket.on('botMessage', (message) => {
  const messageElement = document.createElement('p');
  messageElement.innerText = message;
  messages.appendChild(messageElement);
});