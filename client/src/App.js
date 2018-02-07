import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
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
      {blog.contentReact}
    </div>
  );
}

function BlogList({blogs}) {
  return blogs.article.map(
    (article, index) => <BlogPreview key={index} id={index} blog={article} />
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
      article: blogs.map(value => ({...value, contentReact: contentToReactComponent(value)}))
    };
    return (
      <Router>
        <BlogApp blogs={reactBlogs}/>
      </Router>
    );
  }
}

export default App;
