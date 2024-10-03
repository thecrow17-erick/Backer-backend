import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const main = async (): Promise<void> => {
  try {
    const userAdmin = await prisma.user.create({
      data: {
        code: '0000000000',
        password: bcrypt.hashSync('1234567', bcrypt.genSaltSync(10)),
        username: 'admin',
        sexo: 'M',
        telephono: '76679596',
        role: {
          create: {
            name: 'admin',
            description: 'Administrador de todo el sistema',
          },
        },
      },
    });

    await prisma.permission.createMany({
      data: [
        {
          name: 'ver roles',
        },
        {
          name: 'crear roles',
        },
        {
          name: 'editar roles',
        },
        {
          name: 'eliminar roles',
        },
        {
          name: 'crear usuarios',
        },
        {
          name: 'editar usuarios y roles',
        },
      ],
    });

    const findPermission = await prisma.permission.findMany();
    await prisma.role_Permission.createMany({
      data: findPermission.map(p => ({
        permissionId: p.id,
        roleId: userAdmin.roleId,
      })),
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
