import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import VueMathjax from 'vue-mathjax-next'
import { createMetaManager } from "vue-meta";
import { marked } from "marked";
// import { katex } from 'katex';
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

const katex = require("katex");
const config = require("@/global_config");

const backend_ip = config.backend_ip;
const backend_port = config.backend_port;
const blog_asset_host = config.blog_asset_host;

const renderer = new marked.Renderer();
// const baseUrl = 'http://' + backend_ip + ':' + backend_port;
const baseUrl = blog_asset_host;

renderer.image = (href: string) => {
  let full_url: string;
  if (href.search("http") != -1) {
    full_url = href;
  } else {
    full_url = baseUrl + href;
  }

  return `
        <p align="center">
            <a alt="image">
                <img src="${full_url}" style="width:90%">
            </a>
        </p>`;
};

renderer.paragraph = (text: string) => {
  let space_text: string;
  if (text[0] != "　") {
    space_text = "　　" + text;
  } else {
    space_text = text;
  }

  return `
        <p style="font-size: 16px; line-height: 29px;">${space_text}</p>`;
};

renderer.code = (text: string) => {
  const text_list = text.split("\n");
  return `
        <p><code style="
                display: block;
                background-color: #eaeaea;
                font-size: 14px;
                line-height: 25px;
                border-radius: 6px;
                width: 100%;
                padding: 15px 20px 15px 20px;">
            ${text_list.filter(Boolean).join("<br>")}
        </code></p>`;
};

renderer.codespan = (text: string) => {
  return `
        <code style="
                background-color: #eaeaea;
                font-size: 16px;
                line-height: 29px;
                border-radius: 2px;
                padding: 3px 5px 3px 5px;">
            ${text}</code>`;
};

renderer.blockquote = (text: string) => {
  const text_list = text.split("\n");

  return `
        <blockquote style="
                font-size: 16px;
                line-height: 29px;
                padding: 15px 20px 6px 20px;
                border-left: 3px solid #6499e3;
                background-color: #e3f2fd">${text_list
                  .filter(Boolean)
                  .join("<br>")}</blockquote>`;
};

renderer.heading = (text: string, level: number) => {
  // console.log(text);
  const escapedText = text.toLowerCase();
  // console.log(escapedText);
  let font_size;
  if (level == 2) {
    font_size = 24;
  } else if (level == 3) {
    font_size = 21;
  } else if (level == 4) {
    font_size = 18;
  } else if (level == 5) {
    font_size = 18;
  } else {
    font_size = 16;
  }

  return `
        <h${level} style="font-size: ${font_size}px;
                font-weight: bold;
                margin-top: 30px;
                border-bottom: 1px solid #eaecef;">
            <a name="${escapedText}" class="header-anchor" href="#${escapedText}">
                <span class="header-link"></span>
            </a>
            ${text}
        </h${level}>`;
};

renderer.strong = (text: string) => {
  // console.log(text);
  if (text.length > 15) {
    return `<strong>${text}</strong>`;
  }

  const prob: number = Math.random();

  if (prob > 0.85) {
    return `<strong style="color: #ff0000">${text}</strong>`;  // red
  } else if (prob > 0.75) {
    return `<strong style="color: #eeaa00">${text}</strong>`;  // orange
  } else if (prob > 0.3) {
    return `<strong style="color: #00b441">${text}</strong>`;  // green
  } else if (prob > 0.15) {
    return `<strong style="color: #92D050">${text}</strong>`;  // light green
  } else {
    return `<strong style="color: #00b2f6">${text}</strong>`;  // blue
  }
};

marked.use({ renderer });

const TableRender = {
  name: "TableRender",
  level: "block",
  start(src: string) {
    return src.indexOf("|");
  },

  tokenizer(src: string, tokens: any) {
    const match = src.match(/^\$([^$\n]+?)\$/);
    if (match) {
      // console.log(tokens);
      const trimText = match[1].trim();

      return {
        type: "inlineKatex",
        raw: match[0],
        text: trimText,
      };
    }
  },

  renderer(token: any) {
    return katex.renderToString(token.text, {
      throwOnError: false,
      displayMode: false,
    });
  },
};

const inlineKatex = {
  name: "inlineKatex",
  level: "inline",
  start(src: string) {
    return src.indexOf("$");
  },
  tokenizer(src: string, tokens: any) {
    const match = src.match(/^\$([^$\n]+?)\$/);
    if (match) {
      // console.log(tokens);
      const trimText = match[1].trim();

      return {
        type: "inlineKatex",
        raw: match[0],
        text: trimText,
      };
    }
  },

  renderer(token: any) {
    return katex.renderToString(token.text, {
      throwOnError: false,
      displayMode: false,
    });
  },
};

const inlineKatexDisplay = {
  name: "inlineKatexDisplay",
  level: "inline",
  start(src: string) {
    return src.indexOf("$");
  },
  tokenizer(src: string, tokens: any) {
    const match = src.match(/^\$\$([^$]+?)\$\$/); // 去除换行符与否是个问题
    if (match) {
      // console.log(tokens);
      const trimText = match[1].trim();

      return {
        type: "inlineKatexDisplay",
        raw: match[0],
        text: trimText,
      };
    }
  },

  renderer(token: any) {
    return katex.renderToString(token.text, {
      throwOnError: false,
      displayMode: true,
    });
  },
};

marked.use({ extensions: [inlineKatex, inlineKatexDisplay] });

const markedMixin = {
  methods: {
    md: function (input: string) {
      return marked.parse(input);
    },
  },
};

const app = createApp(App)
  // .use(VueMathjax)
  .mixin(markedMixin)
  // .mixin(katexMixin)
  .use(router)
  .use(Antd)
  .use(createMetaManager());

app.mount("#app");
