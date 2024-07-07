export const userFilterableFields: string[] = [
  'searchTerm',
  'name',
  'email',
  'role',
];

export const userSearchAbleFields: string[] = ['name', 'email', 'role'];

export const userRelationalFields: string[] = ['profile', 'posts', 'links'];

export const userRelationalFieldsMapper: { [key: string]: string } = {
  profile: 'profile',
  posts: 'post',
  links: 'link',
};
