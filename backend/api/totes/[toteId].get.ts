export default defineEventHandler((event) => {
  const toteId = getRouterParam(event, "toteId");

  return { toteId };
});
