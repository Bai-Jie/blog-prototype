import React from "react";
import MarkdownIt from 'markdown-it';

const blog = {
  article: [
    {title: "title 0", content: {format: "plaintext", content: "blog 0"}},
    {title: "title 1", content: {format: "plaintext", content: "blog 1"}},
    {title: "title 2", content: {format: "plaintext", content: "blog 2"}},
    {title: "title 3", content: {format: "plaintext", content: "blog 3"}},
    {title: "title 4", content: {format: "plaintext", content: "blog 4"}},
    {title: "title 5", content: {format: "plaintext", content: "blog 5"}},
    {title: "markdown sample", content: {format: "markdown", content: "Hello from **Markdown** "}}
  ]
};

const contentRenders = {};

const md = new MarkdownIt();
contentRenders.markdown = value => <p dangerouslySetInnerHTML={{__html: md.render(value)}}/>;

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
