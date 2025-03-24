import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/**/*.ts'],  // assuming your source files are in "src"
    outDir: 'dist',
    format: ['esm'],
    target: 'node20',
    dts: false,       // Disable type declaration generation
    sourcemap: false, // Disable source maps
    clean: true,
    external: ['@prisma/client'], // you don’t want to bundle Prisma clients!
});
