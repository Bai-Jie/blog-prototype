import React from "react";
import MarkdownIt from 'markdown-it';
import {sanitizeHtml} from "./utils/html-sanitizer";

const blog = {
  article: [
    {title: "title 0", content: {format: "plaintext", content: "blog 0"}},
    {title: "title 1", content: {format: "plaintext", content: "blog 1"}},
    {title: "title 2", content: {format: "plaintext", content: "blog 2"}},
    {title: "title 3", content: {format: "plaintext", content: "blog 3"}},
    {title: "title 4", content: {format: "plaintext", content: "blog 4"}},
    {title: "title 5", content: {format: "plaintext", content: "blog 5"}},
    {title: "raw html sample", content: {format: "html", content: "Hello from <strong>HTML</strong> <script>alert('bad')</script>"}},
    {title: "markdown sample", content: {format: "markdown", content: "Hello from **Markdown** <script>alert('bad')</script>"}}
  ]
};

const contentRenders = {};

const md = new MarkdownIt();
contentRenders.markdown = value => <p dangerouslySetInnerHTML={{__html: md.render(value)}}/>;

contentRenders.html = value => <p dangerouslySetInnerHTML={{__html: sanitizeHtml(value)}}/>;

function contentToReactComponent({format, content}) {
  const render = contentRenders[format];
  if (render) {
    return render(content);
  } else {
    return <p>{content}</p>;
  }
}

export const blog2 = {
  article: blog.article.map(value => ({...value, contentReact: contentToReactComponent(value.content)}))
};
