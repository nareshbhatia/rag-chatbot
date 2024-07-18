# Vercel AI Chatbot

## Development Build

Copy `.env.example` to `.env.local` and fill in the variables. Then:

```shell
npm ci
npm run dev
```

Now point your browser to http://localhost:3000

## User interactions

### 1. Crawl a web page

Crawl a web page and store the resulting vector embeddings in Pinecone:

-----> POST /api/crawl
https://www.asiafinancial.com/india-now-worlds-third-biggest-generator-of-solar-power

```js
{ splittingMethod: 'markdown', chunkSize: 256, overlap: 1 }
```

### 2. Ask a question

-----> POST /api/chat

```js
[
  {
    role: 'user',
    content:
      'How much solar capacity did India install in the first quarter of 2024?',
  },
];
```

### 3. LLM answers

-----> POST /api/context

```js
[
  {
    id: 'JAPDcGK',
    role: 'user',
    content:
      'How much solar capacity did India install in the first quarter of 2024?',
  },
  {
    id: 'kX7B8vV',
    role: 'assistant',
    content:
      'India installed a record solar capacity of 8.5 GW in the first quarter of 2024.',
    createdAt: '2024-07-18T22:30:47.630Z',
  },
];
```
