# Vite + Firebase + TanStack Router Template

A modern React template with TypeScript, featuring real-time data synchronization, authentication, and a beautiful UI right out of the box.

<img width="1710" alt="image" src="https://github.com/user-attachments/assets/fac8b7c8-5386-4e4d-80f6-c18806943d03" />



## Features

- 🔥 **Firebase Integration** - Built-in authentication and real-time database functionality
- 🛣️ **TanStack Router** - Type-safe routing with built-in loading states and data handling
- 🌓 **Dark Mode** - Automatic dark mode support with theme persistence
- 🎨 **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- 📝 **TypeScript** - Full type safety and improved developer experience
- ⚡ **Vite** - Lightning fast development server and build tool
- 🎯 **Shadcn/ui** - Beautiful, accessible UI components

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/connorp987/vite-firebase-tanstack-router-template.git
   cd vite-firebase-tanstack-router-template
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Firebase configuration:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase credentials in `.env`

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_PUBLIC_FIREBASE_API_KEY=
VITE_PUBLIC_FIREBASE_AUTH_DOMAIN=
VITE_PUBLIC_FIREBASE_PROJECT_ID=
VITE_PUBLIC_FIREBASE_STORAGE_BUCKET=
VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
VITE_PUBLIC_FIREBASE_APP_ID=
VITE_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Adding UI Components

This template uses [shadcn/ui](https://ui.shadcn.com/) for UI components. To add a new component:

```bash
npx shadcn-ui@latest add <component-name>
```

Components can be customized in `./src/components/ui`.

## Helpful Links

* [Shadcn/ui Documentation](https://ui.shadcn.com/)
* [TanStack Router Documentation](https://tanstack.com/router/latest)
* [Firebase Documentation](https://firebase.google.com/docs/auth/web/start)
* [Tailwind CSS Documentation](https://tailwindcss.com/docs/installation)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
