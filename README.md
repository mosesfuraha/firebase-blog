# FirebaseBlog

This project was generated with Angular CLI version 18.2.0.

## Deployed Version

You can access the deployed version of this application at: [https://crud-learn-b8dac.web.app/](https://crud-learn-b8dac.web.app/)

## Key Features

1. **Server-Side Rendering (SSR) with Angular Universal**

   - The app utilizes **Angular Universal** to pre-render pages on the server, providing better performance and improved SEO.
   - This improves Time-to-First-Byte (TTFB) and makes the application accessible even to users with slow connections.

2. **SEO Optimization**

   - Includes a service for managing **meta tags**, which dynamically updates metadata for each blog post.
   - Structured data follows **JSON-LD** format for better search engine understanding.

3. **Progressive Web App (PWA) Support**

   - Fully capable of functioning as a **PWA**, providing:
     - **Offline access**: Previously viewed blog posts are accessible offline.
     - **Add to Home Screen**: Users can install the app on their devices.
     - **Service Worker**: Caches static assets and API responses for seamless offline experiences.

4. **Responsive Design**
   - Optimized for both desktop and mobile users using **Tailwind CSS** utilities.

5. **User Interaction Features**
   - **View Blogs**: Users can browse and read all published blog posts.
   - **Like System**: Users can like blog posts to show appreciation.
   - **Commenting System**: Users can leave comments on blog posts, fostering community engagement.
   - **User-specific Content Management**:
     - Users can create their own blog posts.
     - Users can edit and delete only the blog posts they have created.
     - Users cannot modify or delete posts created by others.

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

To test on your local network:

1. Find your computer's IP address on your local network.
2. Run `ng serve --host 0.0.0.0 --disable-host-check`.
3. On your phone, navigate to `http://<your-computer-ip>:4200`.

## Build

Run `ng build` to build the project. Build artifacts will be stored in the `dist/` directory.

## Service Worker and Offline Access

The app includes a **service worker** configuration for asset caching and offline functionality.

## Testing on Mobile Devices

1. Ensure your phone and computer are on the same Wi-Fi network.
2. Run the development server with network access.
3. On your phone, open a web browser and navigate to the app's address.
4. Test responsiveness, PWA features, and offline functionality.

## Installing the PWA on Your Device

1. Open the app in your mobile browser.
2. For Android: Tap the three-dot menu in Chrome and select "Add to Home screen".
3. For iOS: Tap the share button in Safari and select "Add to Home Screen".
4. Follow on-screen prompts to complete installation.

## Scripts

Add these scripts to your `package.json`:

```json
"scripts": {
  "ng": "ng",
  "build": "ng build",
  "build:ssr": "ng build && ng run firebase-blog:server",
  "serve:ssr": "node dist/firebase-blog/server/main.js",
  "build:deploy": "npm run build:ssr && npm run build:server && firebase deploy",
  "start:local-network": "ng serve --host 0.0.0.0 --disable-host-check"
}
```

- Use `npm run start:local-network` to start the server for local network testing.
- Use `npm run build:ssr` to build the project for server-side rendering.
- Use `npm run serve:ssr` to serve the server-side rendered application locally.
- Use `npm run build:deploy` to build and deploy the application to Firebase.

## User Guidelines

- All users can view, like, and comment on any blog post.
- Users must create an account to publish their own blog posts.
- Users can only edit or delete blog posts they have created.
- Respect community guidelines when commenting or creating posts.

Remember to thoroughly test all features, especially user-specific functionalities, on various devices and network conditions before deploying to production.