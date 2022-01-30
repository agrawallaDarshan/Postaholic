const CommentForm = ({ comment, setComment, addComment, reply = false }) => {
  return (
    <>
      <form>
        <input
          type="text"
          className="form-control"
          placeholder={reply ? "Drop your comment" : "Drop your reply"}
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
