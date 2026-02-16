import { prisma } from "../prisma";

export async function deleteConversation(userId: string) {
  const result = await prisma.message.updateMany({
    where: {
      userId,
      deleted: false,
    },
    data: {
      deleted: true,
    },
  });

  return { result, success: true };
}

export async function deleteUser(userId: string) {
  const result = await prisma.$transaction([
    prisma.message.deleteMany({ where: { userId } }),
    prisma.profile.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  return { result, success: true };
}
