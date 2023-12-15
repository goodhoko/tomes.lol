export default async (req, context) => {
  return new Response(`secret: ${process.env.VARIABLE_NAME}`);
};
