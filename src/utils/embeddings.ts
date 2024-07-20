import { OpenAIApi, Configuration } from 'openai-edge';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function getEmbeddings(input: string) {
  const strippedInput = input.replace(/\n/g, ' ');
  console.log(
    `-----> getEmbeddings: openai.createEmbedding(${strippedInput.slice(0, 10)}...)`,
  );
  try {
    const response = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: strippedInput,
    });

    const result = await response.json();
    console.log(
      `-----> getEmbeddings: received: ${result.data.length} embedding with length ${result.data[0].embedding.length}`,
    );
    return result.data[0].embedding as number[];
  } catch (e) {
    console.log('Error calling OpenAI embedding API: ', e);
    throw new Error(`Error calling OpenAI embedding API: ${e}`);
  }
}
