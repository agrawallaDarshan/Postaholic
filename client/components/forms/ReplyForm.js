const ReplyForm = ({ reply, setReply, addReply }) => {
  return (
    <>
      <form className="bg">
        <input
          type="text"
          className="form-control bg"
          placeholder="Drop your reply"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <button className="btn btn-primary btn-sm mt-3" onClick={addReply}>
          Post
        </button>
      </form>
    </>
  );
};

export default ReplyForm;
