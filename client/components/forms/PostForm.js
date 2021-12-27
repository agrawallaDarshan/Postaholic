const PostForm = () => {
  return (
    <div className="card">
      <div className="card-body">
        <form className="form-group">
          <textarea className="form-control" placeholder="write something..."></textarea>
        </form>
      </div>

      <div className="card-footer">
        <button className="btn btn-primary btn-sm">Post</button>
      </div>
    </div>
  );
};

export default PostForm;
