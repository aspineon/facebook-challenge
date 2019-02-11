export default {
  collection: 'posts',
  populates: [{ child: 'createdBy', root: 'users' }],
  orderBy: ['createdAt', 'desc'],
  limit: 5
}
