import rehype from 'rehype';
import sanitize from 'rehype-sanitize';

const sanitizer = rehype()
  .use(sanitize);

export function sanitizeHtml(rawHtml) {
  return sanitizer
    .processSync(rawHtml);
}
