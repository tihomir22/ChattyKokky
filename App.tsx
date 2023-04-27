/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {Chat, MessageType} from '@flyerhq/react-native-chat-ui';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import type {PropsWithChildren} from 'react';
import {ActivityIndicator, View} from 'react-native';
import axios from 'axios';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

function App(): JSX.Element {
  const [messages, setMessages] = useState<MessageType.Text[]>([]);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const user = {id: '06c33e8b-e835-4736-80f4-63f44b66666c'};
  const server = {id: '06c33e8b-e835-4736-80f4-63f44b61488c'};
  const addMessage = (message: MessageType.Text) => {
    const actualMessages = messages;
    actualMessages.unshift(message);
    setMessages(actualMessages);
  };

  const createTextMessage = (message: string, author: {id: string}) => {
    const textMessage: MessageType.Text = {
      author,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message,
      type: 'text',
    };
    return textMessage;
  };

  const sendPrompt = async (text: string) => {
    setAwaitingResponse(true);
    try {
      const axiosResponse = await axios.post(
        'https://8268-84-127-212-50.ngrok-free.app/answer',
        {mensaje: text},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const textMessage = createTextMessage(
        axiosResponse.data.respuesta,
        server,
      );
      addMessage(textMessage);
      setAwaitingResponse(false);
    } catch (error) {
      const textMessage = createTextMessage(
        'An error happened on the server :(',
        server,
      );
      addMessage(textMessage);
      setAwaitingResponse(false);
    }
  };

  const handleSendPress = (message: MessageType.PartialText) => {
    const textMessage = createTextMessage(message.text, user);
    addMessage(textMessage);
    sendPrompt(message.text);
  };
  return (
    <SafeAreaProvider>
      {awaitingResponse && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.5,
            backgroundColor: 'white',
          }}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <Chat
        messages={messages}
        showUserNames={true}
        onSendPress={message => {
          handleSendPress(message);
        }}
        user={user}
      />
    </SafeAreaProvider>
  );
}

export default App;
