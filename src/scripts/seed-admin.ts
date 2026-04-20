import bcrypt from 'bcrypt';
import { closeMongo, connectMongo } from '../config/mongodb';
import { env } from '../config/env';
import { usersRepository } from '../modules/users/users.repository';
import { UserRoles, UserStatuses } from '../modules/users/users.types';

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

async function seedAdmin(): Promise<void> {
  const email = normalizeEmail(env.defaultAdminEmail);
  const password = env.defaultAdminPassword;

  if (!email) throw new Error('DEFAULT_ADMIN_EMAIL is not set');
  if (!password) throw new Error('DEFAULT_ADMIN_PASSWORD is not set');

  await connectMongo();

  const existingUser = await usersRepository.findByEmail(email);

  if (existingUser) {
    if (!existingUser.roles.includes(UserRoles.ADMIN)) {
      await usersRepository.addRole(existingUser.id, UserRoles.ADMIN);
      console.log(`User ${email} was promoted to admin.`);
    } else {
      console.log(`User ${email} is already an admin.`);
    }

    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await usersRepository.create({
    id: crypto.randomUUID(),
    email,
    password: hashedPassword,
    roles: [UserRoles.ADMIN],
    status: UserStatuses.ACTIVE,
  });

  console.log(`Admin user ${email} was created.`);
}

void seedAdmin()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongo();
  });
