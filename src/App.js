import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  withRouter
} from 'react-router-dom'
import './App.css';
import {blog2 as blog} from "./MockData";

function BlogPreview({id, blog, onClickBlog}) {
  return (
    <div>
      <h2 onClick={onClickBlog.bind(this, id)}>{blog.title}</h2>
      {/*<p>{blog.content}</p>*/}
    </div>
  );
}

function BlogView({blog}) {
  return (
    <div>
      <h2>{blog.title}</h2>
      {blog.contentReact}
    </div>
  );
}

function BlogList({blogs, onClickBlog}) {
  return blogs.article.map(
    (article, index) => <BlogPreview key={index} id={index} blog={article} onClickBlog={onClickBlog}/>
  );
}

class BlogApp extends Component {

  onClickBlog = id => {
    const {history} = this.props;
    history.push(`/blogs/${id}`)
  };

  render() {
    const blogs = blog;

    return (
      <div className="App">
        <Route exact path="/" render={() => (
          <BlogList blogs={blogs} onClickBlog={this.onClickBlog}/>
        )}/>
        <Route path="/blogs/:id" render={({match}) => (
          <BlogView blog={blogs.article[match.params.id]}/>
        )}/>
      </div>
    );
  }
}

const WrapBlogApp = withRouter(BlogApp);

function App() {
  return (
    <Router>
      <WrapBlogApp/>
    </Router>
  );
}

export default App;
