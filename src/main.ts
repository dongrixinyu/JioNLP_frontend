import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createMetaManager } from "vue-meta";
import { marked } from "marked";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

const katex = require("katex");
const config = require("@/global_config");

const backend_ip = config.backend_ip;
const backend_port = config.backend_port;
const blog_asset_host = config.blog_asset_host;

const renderer = new marked.Renderer();

const baseUrl = blog_asset_host;

renderer.image = (href: string) => {
  // url 字符串自定义了一种 {class: "auto-resize", "width": 100%} 这种参数配置方法
  // 类似于这种 { width: 60 %; height: auto }，但不允许有空格
  // 需要解析一下
  let full_url: string;
  let image_style: string;
  const regex = /\{(.*)\}/;
  const match = regex.exec(href);

  console.log("[main.ts][renderer.image] ", href);

  if (match && match[1]) {

    image_style = match[1];
    full_url = href.replace(regex, "");
    console.log("[main.ts][renderer.image] image_style ", image_style);
    console.log("[main.ts][renderer.image] full_url ", full_url);
  } else {
    image_style = "";
    full_url = href;
  }


  if (!full_url.startsWith("http")) {
    // 使用URL对象来构建完整的URL，这可以自动处理相对URL的情况
    full_url = baseUrl + href;
  } else {
    // 如果full_url已经是一个完整的URL，不需要再次赋值
  }

  if (image_style === "") {
    return `
      <p align="center">
        <a alt="image">
          <img src="${full_url}" class="auto-resize" style="width:90%;height:auto;">
        </a>
      </p>`;
  } else {
    return `
      <p align="center">
        <a alt="image">
          <img src="${full_url}" class="auto-resize" style="${image_style}">
        </a>
      </p>`;
  }

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
  console.log("[main.ts][code] text ", text);
  console.log("[main.ts][code] text_list ", text_list);
  return `
    <p>
      <code style="
        white-space: pre-wrap;
        display: block;
        background-color: #eaeaea;
        font-size: 14px;
        line-height: 25px;
        border-radius: 6px;
        width: 100%;
        padding: 15px 20px 15px 20px;">${text_list.join("<br>")}
      </code>
    </p>`;
};

renderer.codespan = (text: string) => {
  return `
        <code style="
          background-color: #eaeaea;
          font-size: 16px;
          line-height: 29px;
          border-radius: 2px;
          padding: 3px 5px 3px 5px;"
        >
          ${text}
        </code>`;
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

renderer.list = (text: string, ordered: boolean) => {
  const type = ordered ? 'ol' : 'ul';
  // 添加自定义属性，例如 class
  return `
  <${type} style="background-color: #dffff5;">
    ${text}
  </${type}>`;
};

renderer.listitem = (text: string) => {
  return `
    <li style="
      display: list-item;
      text-align: -webkit-match-parent;
      unicode-bidi: isolate;
      font-size: 16px;
      margin-bottom: 1em;"
    >
      ${text}
    </li>`;
};

renderer.table = (header: string, body: string) => {
  return `
    <table style="
        border: 2px solid black;
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 20px;
        text-align: center;">
      <thead style="
          background-color: #dffff5;">
        ${header}
      </thead>
      <tbody>
        ${body}
      </tbody>
    </table>`;
};

renderer.tablecell = (text: string, header: boolean) => {
  const type = header ? 'th' : 'td';
  // console.log("[main.ts][tablecell] type", type);
  if (type === "td") {
    return `
      <${type} style="
        border: 1px solid black;
        font-weight: normal;
        padding: 3px;"
      >
        ${text}
      </${type}>`;
  } else {
    return `
      <${type} style="
        border: 1px solid black;
        font-weight: normal;
        padding: 5px;"
      >
        ${text}
      </${type}>`;
  }


}

renderer.tablerow = (text: string) => {
  return `
    <tr style="font-weight: bold !important;">
      ${text}
    </tr>`;
}

renderer.heading = (text: string, level: number) => {
  // console.log(text);
  const escapedText = text.toLowerCase();
  // console.log(escapedText);
  let font_size;
  if (level == 1) {
    font_size = 25;
  } else if (level == 2) {
    font_size = 23;
  } else if (level == 3) {
    font_size = 21;
  } else if (level == 4) {
    font_size = 19;
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
        <span class="header-link">
        </span>
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
    markdown_renderer: function (input: string) {
      return marked.parse(input);
    },
  },
};

const app = createApp(App)
  .mixin(markedMixin)
  .use(router)
  .use(Antd)
  .use(createMetaManager());

app.mount("#app");
