# Copilot Instructions for ToteLink Project

## Project Tech Stack

- **Framework:** React with Vite
- **Language:** TypeScript
- **Routing:** TanStack Router
- **Styling:** Tailwind CSS with DaisyUI component library
- **Icons:** Lucide React
- **Database/Backend:** Supabase
- **Linting/Formatting:** ESLint (config: `eslint.config.js`)
- **Package Manager:** npm

## Key Files and Folders

- `vite.config.ts`: Vite configuration.
- `tsconfig.json`: TypeScript configuration.
- `package.json`: Project dependencies and scripts.
- `index.html`: Main HTML entry point.
- `src/main.tsx`: Main React app initialization.
- `src/index.css`: Global styles, Tailwind CSS directives.
- `src/routes/`: TanStack Router route components.
  - `__root.tsx`: Root layout component.
  - `*.tsx` (e.g., `totes.tsx`, `index.tsx`): Route definitions.
  - Dynamic routes: `$` prefix (e.g., `totes_.$toteId.tsx`).
- `src/components/`: Reusable React components.
- `src/database/`: Supabase client, types, queries.
  - `supabase.ts`: Supabase client initialization.
  - `database.types.ts`: Supabase schema TypeScript types.
  - `queries.ts`: Database query functions.
- `src/hooks/`: Custom React hooks (e.g., `useAuth.ts`).
- `public/`: Static assets.

## Development Workflow Summary

### Running Dev Server

```bash
npm run dev
```

(Usually `http://localhost:5173`)

### Creating New TanStack Routes

- Location: `src/routes/`
- Convention: New `.tsx` file.
- Definition: Use `createFileRoute`. Export `Route` component.
- Auto-discovery: `routeTree.gen.ts` (may require dev server restart).
- Example (`src/routes/new-page.tsx`):

  ```typescript jsx
  import { createFileRoute } from \'@tanstack/react-router\';

  export const Route = createFileRoute(\'/new-page\')({
    component: NewPageComponent,
  });

  function NewPageComponent() {
    return <div>This is a new page!</div>;
  }
  ```

### Creating Components

- Location: `src/components/`
- Type: Functional components with TypeScript.
- Styling: Tailwind CSS and DaisyUI classes.
- Example (`src/components/MyButton.tsx`):

  ```typescript jsx
  import React from \'react\';

  interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: \'primary\' | \'secondary\';
  }

  export function MyButton({ children, className, variant = \'primary\', ...props }: MyButtonProps) {
    const baseClasses = \'btn\';
    const variantClasses = {
      primary: \'btn-primary\',
      secondary: \'btn-secondary\',
    };

    return (
      <button className={`${baseClasses} ${variantClasses[variant]} ${className || \'\'}`} {...props}>
        {children}
      </button>
    );
  }
  ```

### Styling

- **Tailwind CSS:** Utility classes in JSX.
- **DaisyUI:** Component classes (e.g., `btn`, `card`).
- **Global Styles:** `src/index.css`.

### Icons

- **Library:** `lucide-react`.
- **Usage:** Import directly.
- Example:

  ```typescript jsx
  import { Home, User } from \'lucide-react\';

  function MyComponent() {
    return (
      <div>
        <Home className="size-6" />
        <User color="red" size={24} />
      </div>
    );
  }
  ```

### Database (Supabase)

- Query Functions: `src/database/queries.ts`.
- Client Init: `src/database/supabase.ts`.
- Type Sync: Keep `database.types.ts` updated with Supabase schema.

### Linting

- Tool: ESLint.
- Command:
  ```bash
  npm run lint
  ```
