# HumanJobs

HumanJobs is a ChatGPT Plugin that lets users create job postings for tasks ChatGPT can't handle yet.

## Demo

TODO

## Development Quickstart

1. Clone the repository:

   ```bash
   git clone git@github.com:woniesong92/humanjobs.git
   cd humanjobs
   ```

2. Install dependencies:

   ```bash
   yarn
   ```

3. Create a copy of the sample environment file:
   ```bash
   cp .env.sample .env
   ```
   Update the value of the env variable `DATABASE_URL` in `.env`

4. Start the dev server:
   ```bash
   yarn dev
   ```

   Start the development server:

5. Open localhost:3000 in your web browser to confirm that the app is running correctly.

6. Choose "Plugin store" from the model dropdown.

7. Click "Develop your own plugin".

8. Enter localhost:3000 as the URL.

9. See it in action!

## Deployment

1. Update the urls in `public/.well-known/ai-plugin.json`
2. Update the server url in `public/openapi.yaml`
3. Deploy it to your favorite hosting provider
4. From ChatGPT, enter your new url after clicking "Develop your own plugin."

## Gotchas

- ChatGPT can hallucinate extra parameters for your service's endpoints, ignoring what is described in `openapi.yaml`. To prevent this from happening, you can try describing your API interface in `description_for_model` in `ai-plugin.json`.