import React from 'react';
import {sanitizeHtml} from "./utils/html-sanitizer";
import MarkdownIt from "markdown-it";

const contentRenders = {};

const md = new MarkdownIt();
contentRenders.markdown = value => <p dangerouslySetInnerHTML={{__html: md.render(value)}}/>;

contentRenders.html = value => <p dangerouslySetInnerHTML={{__html: sanitizeHtml(value)}}/>;

export function contentToReactComponent({format, content}) {
  const render = contentRenders[format];
  if (render) {
    return render(content);
  } else {
    return <p>{content}</p>;
  }
}

export function fetchBlogs() {
  const data = {
    query:
      `
      {
        hello,
        blogs {
          title
          format
          content
        }
      }
      `

  };
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  };
  return fetch('http://bigpc:8080/graphql', options)
    .then(response => response.json())
    .then(response => response.data.blogs);
}
