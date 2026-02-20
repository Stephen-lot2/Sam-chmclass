# How to Restore Full App

Once the simple version works, restore the full app:

## Windows:

```bash
copy src\App.jsx.backup src\App.jsx
```

## Mac/Linux:

```bash
cp src/App.jsx.backup src/App.jsx
```

Then restart the dev server (Ctrl+C and run `npm run dev` again)
