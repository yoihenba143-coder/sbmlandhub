import prisma from "./../lib/prisma";

async function main() {
  const propertyCount = await prisma.property.count();
  const submissionCount = await prisma.propertySubmission.count();
  const inquiryCount = await prisma.inquiry.count();
  console.log({ propertyCount, submissionCount, inquiryCount });

  const submissions = await prisma.propertySubmission.findMany();
  console.log("Submissions in DB:", submissions);
}

main().catch(console.error).finally(() => process.exit(0));
