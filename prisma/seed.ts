import { Permission, PrismaClient } from '@prisma/client';
import { genSalt, hash } from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  // Define the groups and their permissions
  const groups = [
    {
      name: 'dashboard',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'roles',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'groups',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'permission',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'users',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'products',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'brand',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'attribute',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'outlet',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'category',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'uploadedFiles',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'banner',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'sideBanner',
      permissions: ['view', 'create', 'update', 'delete'],
    },
  ];

  // Create the groups and their permissions
  const createdPermissions: Permission[] = [];
  for (const group of groups) {
    const createdGroup = await prisma.permissionGroup.create({
      data: {
        name: group.name,
      },
    });

    for (const permission of group.permissions) {
      const createdPermission = await prisma.permission.create({
        data: {
          name: `${group.name}.${permission}`,
          group_id: createdGroup.id,
        },
      });

      createdPermissions.push(createdPermission);
    }
  }

  // Create the user with the role and permissions
  const userCreate = await prisma.user.create({
    data: {
      email: 'super_admin@kids.com',
      first_name: 'Mr.',
      last_name: 'Super Admin',
      mobile_number: '0123456789',
      roles: {
        create: {
          name: 'super_admin',
          permissions: {
            connect: createdPermissions.map(permission => ({
              id: permission.id,
            })),
          },
        },
      },
      password: await hash('admin@123', await genSalt(10)),
      is_admin: true,
    },
  });

  console.log('User created: ', userCreate);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
