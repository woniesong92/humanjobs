# HumanJobs

![human-jobs](https://user-images.githubusercontent.com/2935309/232254066-90562b0c-6b3f-4ad9-8ec7-50a1095d706a.png)

HumanJobs is a ChatGPT Plugin that lets users create job postings for tasks ChatGPT can't handle yet. See how it works in the diagram below.

![Diagram](https://user-images.githubusercontent.com/2935309/232252149-634c5777-24c4-438c-89c5-be8032917a7b.png)

This repo can work as a template if you want to build a ChatGPT plugin with NextJS. If you prefer Python, check out the repo [openai/plugins-quickstart](https://github.com/openai/plugins-quickstart).

## Demo

![demo](https://user-images.githubusercontent.com/2935309/232251838-b37f88b6-3774-4219-8225-a135adb822b3.gif)

To see the job postings created by ChatGPT, go to [humanjobs.xyz](https://humanjobs.xyz)

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

5. Open `localhost:3000` in your web browser to confirm that the app is running correctly.

6. Choose "Plugin store" from the model dropdown.

   <img width="819" alt="image" src="https://user-images.githubusercontent.com/2935309/232250723-d82131f5-d822-4c1a-a6e3-d0ad1dda7f0b.png">

7. Click "Develop your own plugin."

   <img width="1285" alt="image" src="https://user-images.githubusercontent.com/2935309/232250759-1ca255af-3657-4e2d-b5b8-f66a0b9be522.png">

8. Enter localhost:3000 as the URL and click "Find manifest file."

   <img width="649" alt="image" src="https://user-images.githubusercontent.com/2935309/232250781-bbca74c9-2c54-41a5-b948-bb3ac3208744.png">

9. Click "Install localhost plugin."

   <img width="620" alt="image" src="https://user-images.githubusercontent.com/2935309/232250812-7e16de0a-2c65-4f42-ab8b-e295e6cf9c28.png">


## Deployment

1. Update the urls in `public/.well-known/ai-plugin.json`
2. Update the server url in `public/openapi.yaml`
3. Deploy it to your favorite hosting provider
4. From ChatGPT, enter your new url after clicking "Develop your own plugin."

## Gotchas

- ChatGPT does not need the user to say "call this API endpoint." Users enable what plugins should be included in the context of the prompts, and ChatGPT infers when to use which plugins and how to use them.
- ChatGPT can hallucinate extra parameters for your service's endpoints, ignoring what is described in `openapi.yaml`. To prevent this from happening, you can try describing your API interface in `description_for_model` in `ai-plugin.json` when developing your own plugins.
