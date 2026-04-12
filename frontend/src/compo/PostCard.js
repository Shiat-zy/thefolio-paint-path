const PostCard = ({ title, excerpt, date, tag, readTime }) => (
  <div className="post-card">
    <span className="tag">{tag}</span>
    <h2>{title}</h2>
    <p>{excerpt}</p>
    <div className="meta">
      <span>{date}</span>
      <span>{readTime} read</span>
    </div>
  </div>
);

export default PostCard;