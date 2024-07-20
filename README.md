# RAG Chatbot

A chatbot with Retrieval Augmented Generation (RAG).

**Tech Stack**

1. [Vercel AI SDK](https://sdk.vercel.ai/)
2. [OpenAI API](https://platform.openai.com) – GPT-3.5 Turbo model
3. [Pinecone](https://www.pinecone.io/) vector database to store vector
   embeddings

![Screenshot](assets/screenshot.png)

## Development Build

Copy `.env.example` to `.env.local` and fill in the variables. Then:

```shell
npm ci
npm run dev
```

Now point your browser to http://localhost:3000

## User interactions

### 1. Crawl a web page

Crawl a web page and store the resulting vector embeddings in Pinecone.

![Populate embeddings into Pinecone](assets/populate-embeddings-into-pinecone.png)

```txt
[client] crawlDocument: fetch('/api/crawl', https://www.asiafinancial.com/india-now...)

  [server] seed: crawler.crawl(https://www.asiafinancial.com/india-now...)
  [server] seed: received: 1 pages
  [server] getEmbeddings: openai.createEmbedding(* Home * A...)
  [server] getEmbeddings: openai.createEmbedding(Type to se...)
  [server] ... total 19
  [server] getEmbeddings: received: 1 embeddings
  [server] getEmbeddings: received: 1 embeddings
  [server] ... total 19
  [server] chunkedUpsert: pineconeIndex.upsert(19 vectors)

[client] crawlDocument: received 19 documents
```

This sequence results in 19 vectors stored in Pinecone and 19 documents in the
left hand panel in the client.

### 2. Ask a question

![Ask a question](assets/ask-a-question.png)

```txt
[client] HomePage: context null
[client] HomePage: rendering with
[client]   How much solar capacity did India install in the first quarter of 2024?
[client] gotMessages: false

  [server] /api/chat: called with 1 message
  [server] getEmbeddings: openai.createEmbedding(How much s...)
  [server] getEmbeddings: received: 1 embedding with length 1536
  [server] getMatchesFromEmbeddings: pinecone.query(1536 embeddings)
  [server] getMatchesFromEmbeddings: received: 3 matches
  [server] /api/chat: openai.createChatCompletion(1 messages)
  [server] /api/chat: returning a new StreamingTextResponse

[client] HomePage: context null
[client] HomePage: rendering with
[client]   How much solar capacity did India install in the first quarter of 2024?
[client]   India
[client] gotMessages: false

[client] HomePage: context null
[client] HomePage: rendering with
[client]   How much solar capacity did India install in the first quarter of 2024?
[client]   India installed
[client] gotMessages: false

[client] HomePage: context null
[client] HomePage: rendering with
[client]   How much solar capacity did India install in the first quarter of 2024?
[client]   India installed a
[client] gotMessages: false

... more text streamed to client

[client] HomePage: context null
[client] HomePage: rendering with
[client]   How much solar capacity did India install in the first quarter of 2024?
[client]   India installed a record solar capacity of 8.5 GW in the first quarter of 2024.
[client] gotMessages: true

[client] HomePage: fetch('/api/context', 2 messages)

  [server] /api/context: called with 2 messages
  [server] getEmbeddings: openai.createEmbedding(India inst...)
  [server] getEmbeddings: received: 1 embedding with length 1536
  [server] getMatchesFromEmbeddings: pinecone.query(1536 embeddings)
  [server] getMatchesFromEmbeddings: received: 3 matches
  [server] /api/context: returning context with 3 ScoredPineconeRecords

[client] HomePage: received context with 3 strings

[client] HomePage: context
[client]   874e92db5736a2776aacc2c8039f01db
[client]   0dec6cc7c850b46cb957fab8863a71d1
[client]   d00cb214170fe4265eb3edda942e5d49
[client] HomePage: rendering with
[client]   How much solar capacity did India install in the first quarter of 2024?
[client]   India installed a record solar capacity of 8.5 GW in the first quarter of 2024.
[client] gotMessages: true
```
