import prisma from '../../../shared/prisma';

// require nanoid
// const { nanoid } = require('nanoid');

const generateUserName = async (email: string): Promise<string> => {
  // Dynamically import nanoid
  // const { nanoid } = await import('nanoid');

  return 'null';
};

export const UserUtils = {
  generateUserName,
};
