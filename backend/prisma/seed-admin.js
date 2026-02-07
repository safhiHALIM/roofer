const { PrismaClient } = require('../node_modules/@prisma/client');
const bcrypt = require('../node_modules/bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  const email = process.env.ADMIN_EMAIL || 'admin@roofer-univers.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', password: hash, emailVerified: true, name: 'Admin' },
    create: {
      email,
      password: hash,
      name: 'Admin',
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  console.log(`Admin ensured: ${email} / ${password}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
