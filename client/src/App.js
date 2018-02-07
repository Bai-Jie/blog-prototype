import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  withRouter
} from 'react-router-dom'
import './App.css';
import {contentToReactComponent, fetchBlogs} from "./business";

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

  blogs = this.props.blogs;

  onClickBlog = id => {
    const {history} = this.props;
    history.push(`/blogs/${id}`)
  };

  render() {
    const blogs = this.blogs;

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
      article: blogs.map(value => ({...value, contentReact: contentToReactComponent(value)}))
    };
    return (
      <Router>
        <WrapBlogApp blogs={reactBlogs}/>
      </Router>
    );
  }
}

export default App;
