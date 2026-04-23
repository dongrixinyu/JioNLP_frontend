/* eslint-disable */
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
};

declare module 'vue-fab';
// declare module 'vue-mathjax-next';
declare module 'marked';
declare module 'katex';
declare module 'ts-md5/dist/md5';

// Fallback declarations — ensures tsc never errors on missing @types
declare module 'webpack-env';
 