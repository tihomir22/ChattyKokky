/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { Chat, MessageType } from '@flyerhq/react-native-chat-ui'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import type {PropsWithChildren} from 'react';


type SectionProps = PropsWithChildren<{
  title: string;
}>;

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16)
    const v = c === 'x' ? r : (r % 4) + 8
    return v.toString(16)
  })
}


function App(): JSX.Element {
  const [messages, setMessages] = useState<MessageType.Any[]>([])
  const [awaitingResponse,setAwaitingResponse] = useState(false)
  const user = { id: '06c33e8b-e835-4736-80f4-63f44b66666c' }

  const addMessage = (message: MessageType.Any) => {
    setMessages([message, ...messages])
  }

  const handleSendPress = (message: MessageType.PartialText) => {
    const textMessage: MessageType.Text = {
      author: user,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
    }
    addMessage(textMessage)
  }
  return (
    <SafeAreaProvider>
      <Chat
        messages={messages}
        onSendPress={(message)=>{
          handleSendPress(message)
        }}
        user={user}
      />
    </SafeAreaProvider>
  );
}


export default App;
