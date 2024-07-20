'use client';

import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { Chat } from './_components/Chat';
import { Context } from './_components/Context';
import { useChat } from 'ai/react';

function printArray<T>(arr: T[]): void {
  // print with a new line between each element
  console.log(arr.join('\n'));
  console.log(arr.join(', '));
}

export default function HomePage() {
  const [gotMessages, setGotMessages] = useState(false);
  const [context, setContext] = useState<string[] | null>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: async () => {
      setGotMessages(true);
    },
  });

  const prevMessagesLengthRef = useRef(messages.length);

  console.log(
    `-----> HomePage: context ${context === null ? 'null' : context.join('\n')}`,
  );
  console.log(
    `-----> HomePage: rendering with ${messages.map((message) => message.content).join('\n')}`,
  );
  console.log(`-----> gotMessages: ${gotMessages}`);

  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setContext(null);
    setGotMessages(false);
  };

  useEffect(() => {
    const getContext = async () => {
      console.log(
        `-----> HomePage: fetch('/api/context', ${messages.length} messages)`,
      );
      const response = await fetch('/api/context', {
        method: 'POST',
        body: JSON.stringify({
          messages,
        }),
      });
      const { context } = await response.json();
      console.log(
        `-----> HomePage: received context with ${context.length} strings`,
      );
      setContext(context.map((c: any) => c.id));
    };
    if (gotMessages && messages.length >= prevMessagesLengthRef.current) {
      getContext();
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, gotMessages]);

  return (
    <div className="flex flex-col justify-between h-screen bg-gray-800 p-2 mx-auto max-w-full">
      <div className="flex w-full flex-grow overflow-hidden relative">
        <Chat
          input={input}
          handleInputChange={handleInputChange}
          handleMessageSubmit={handleMessageSubmit}
          messages={messages}
        />
        <div className="absolute transform translate-x-full transition-transform duration-500 ease-in-out right-0 w-2/3 h-full bg-gray-700 overflow-y-auto lg:static lg:translate-x-0 lg:w-2/5 lg:mx-2 rounded-lg">
          <Context selected={context} />
        </div>
      </div>
    </div>
  );
}
