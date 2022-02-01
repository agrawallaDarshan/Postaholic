const CommentForm = ({ comment, setComment, addComment}) => {
  return (
    <>
      <form>
        <input
          type="text"
          className="form-control"
          placeholder="Drop your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="btn btn-primary btn-sm mt-3" onClick={addComment}>
          Post
        </button>
      </form>
    </>
  );
};

export default CommentForm;
