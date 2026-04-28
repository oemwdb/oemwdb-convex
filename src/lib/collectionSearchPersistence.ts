export function shouldCarryCollectionSearch(
  pathname: string,
  collectionPrefixes: string[],
) {
  return collectionPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
