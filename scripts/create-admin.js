const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log("--- Create New Admin User ---");

  rl.question('Enter admin email: ', async (email) => {
    rl.question('Enter password (minimum 6 characters): ', async (password) => {
      if (!email || !password || password.length < 6) {
        console.error("Error: Please enter a valid email and a password with at least 6 characters.");
        rl.close();
        return;
      }

      try {
        const hashedPassword = await hash(password, 12);

        const user = await prisma.user.create({
          data: {
            email: email,
            password: hashedPassword,
          },
        });

        console.log(`✅ Admin user created successfully:`);
        console.log(`   Email: ${user.email}`);

      } catch (e) {
        if (e.code === 'P2002') {
          console.error("Error: A user with this email already exists.");
        } else {
          console.error("Error creating user:", e.message);
        }
      } finally {
        await prisma.$disconnect();
        rl.close();
      }
    });
  });
}

main();
