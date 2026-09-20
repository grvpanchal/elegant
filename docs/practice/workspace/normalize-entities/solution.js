export default function normalize(posts) {
  const entities = { users: {}, comments: {}, posts: {} };

  const put = (table, entity) => {
    entities[table][entity.id] = { ...entities[table][entity.id], ...entity };
    return entity.id;
  };

  const result = (posts || []).map((post) =>
    put("posts", {
      id: post.id,
      title: post.title,
      author: put("users", { ...post.author }),
      comments: (post.comments || []).map((c) =>
        put("comments", {
          id: c.id,
          body: c.body,
          author: put("users", { ...c.author }),
        })
      ),
    })
  );

  return { entities, result };
}
