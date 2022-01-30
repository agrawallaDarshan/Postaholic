import PostCard from "./PostCard";

const UserPost = ({
  posts,
  deletePost,
  deleting,
  handleLike,
  handleUnlike,
  handleComment,
  removeComment,
  handleCommentLike,
  handleCommentUnlike,
  handleReply,
}) => {
  return (
    <>
      {posts &&
        posts.map((post) => (
          <PostCard
            post={post}
            deletePost={deletePost}
            deleting={deleting}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleComment={handleComment}
            removeComment={removeComment}
            handleCommentLike={handleCommentLike}
            handleCommentUnlike={handleCommentUnlike}
            handleReply={handleReply}
          />
        ))}
    </>
  );
};

export default UserPost;
