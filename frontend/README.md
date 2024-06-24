This is a real-time collaborative whiteboard application where multiple users can draw and write on a shared canvas in real-time. It uses React, Next.js, and Socket.io for the frontend and Express.js and MongoDB for the backend. Users can create an account, log in, and join a whiteboard. They can draw with a pen tool or write text on the canvas. The application also supports undo and redo functionality. The data is persisted in a MongoDB database. The application is deployed on Vercel.

## In the app

### Home Page

- The home page is accessible at the root URL [http://localhost:3000](http://localhost:3000).
- It displays a welcome message and a list of buttons to navigate to the login and register pages.

### Login Page

- The login page is accessible at [http://localhost:3000/login](http://localhost:3000/login).
- It allows users to enter their email and password to authenticate.
- On successful authentication, the user is redirected to the whiteboard page.

### Register Page

- The register page is accessible at [http://localhost:3000/register](http://localhost:3000/register).
- It allows users to create an account by providing their email, password, and confirm password.
- On successful registration, the user is redirected to the login page.

### Whiteboard Page

- The whiteboard page is accessible at [http://localhost:3000/whiteboard/:id](http://localhost:3000/whiteboard/:id), where `:id` is the ID of the whiteboard.
- It displays a canvas where users can draw and write.
- The page also includes a tool bar with buttons to change the active tool (pen or text), change the color of the drawing, and navigate to the previous or next whiteboard.
- The page also includes a logout button to logout the user.

## Setting up the project in local environment

1. Clone the repository.
2. Install the dependencies by running `npm install` or `yarn install`.
3. Create a `.env.local` file in the root directory of the project.
4. Copy the contents of `.env.example` to `.env.local` and update the environment variables.

## Starting the project in local environment

1. Start the development server by running `npm run dev` or `yarn dev`.
2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploying the project on Vercel

1. Install the Vercel CLI by running `npm install -g vercel` or `yarn global add vercel`.
2. Log in to Vercel by running `vercel login`.
3. Deploy the project by running `vercel`.
4. Follow the prompts to link your GitHub repository and select the desired deployment options.
5. Vercel will automatically deploy the project and provide you with the deployment URL.

Note: Make sure to add the necessary environment variables in the Vercel project settings.
