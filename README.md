# Building from source
Requirements
```
node: >= 20.10.0
pnpm: >= 8.12.1
```

1. Run `pnpm install`
2. Run `pnpm build`. Code is built in `/build`.
3. Run `web-ext build -s build`. Code is packaged to `/web-ext-artifacts`.
