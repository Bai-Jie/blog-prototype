import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom'
import qs from 'qs';
import './App.css';
import {contentToReactComponent, fetchBlogs} from "./business";

function BlogPreview({id, blog}) {
  return (
    <div>
      <h2><Link to={`/blogs/${id}`}>{blog.title}</Link></h2>
    </div>
  );
}

function BlogView({blog}) {
  return (
    <div>
      <h2>{blog.title}</h2>
      {blog.contentReact()}
    </div>
  );
}

const BlogList = withRouter(({location, blogs}) => {
  let {page, pageSize} = qs.parse(location.search.substring(1));
  page = page || 1;
  page = +page;
  pageSize = pageSize || 25;
  pageSize = +pageSize;

  const begin = (page - 1) * pageSize;
  const end = page * pageSize;
  const blogPreviews = blogs.article.slice(begin, end).map(
    (article, index) => <BlogPreview key={index + begin} id={index + begin} blog={article}/>
  );

  const pageLinksResult = pageLinks(page, pageSize, blogs.article.length);
  return (
    <div>
      {pageLinksResult}
      <div>
        {blogPreviews}
      </div>
      {pageLinksResult}
    </div>
  );
});

function pageLinks(currentPage, pageSize, totalSize) {
  const maxPage = Math.ceil(totalSize / pageSize);
  const liTags = [];
  for (let i = 1; i <= Math.min(maxPage, 40); i++) { //TODO improve this
    liTags.push(
      <li key={i} style={{display: 'inline', margin: 4}}>
        {
          currentPage !== i ? <Link to={`/?page=${i}&pageSize=${pageSize}`}>{i}</Link> : i
        }
      </li>
    );
  }
  return (
    <ul style={{
      listStyleType: 'none',
      padding: 0
    }}>
      {liTags}
    </ul>
  );
}

class BlogApp extends Component {

  blogs = this.props.blogs;

  render() {
    const blogs = this.blogs;

    return (
      <div className="App">
        <Route exact path="/" render={() => (
          <BlogList blogs={blogs} />
        )}/>
        <Route path="/blogs/:id" render={({match}) => (
          <BlogView blog={blogs.article[match.params.id]}/>
        )}/>
      </div>
    );
  }
}

class App extends Component {

  state = {blogs: null, isLoading: true};

  constructor(props) {
    super(props);

    fetchBlogs()
      .then(it => this.setState({blogs: it, isLoading: false}));
  }

  render() {
    const {isLoading, blogs} = this.state;
    if (isLoading) {
      return <div>Loading...</div>;
    }

    const reactBlogs = {
      article: blogs.map(value => ({...value, contentReact: () => contentToReactComponent(value)}))
    };
    return (
      <Router>
        <BlogApp blogs={reactBlogs}/>
      </Router>
    );
  }
}

export default App;
