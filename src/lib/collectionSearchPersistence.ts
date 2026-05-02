export function shouldCarryCollectionSearch(
  pathname: string,
  collectionPrefixes: string[],
) {
  return collectionPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export const GLOBAL_BRAND_FILTER_COLLECTION_PATHS = [
  "/vehicles",
  "/builds",
  "/wheels",
  "/colors",
  "/engines",
] as const;

export function collectionSupportsGlobalBrandFilter(pathname: string) {
  return GLOBAL_BRAND_FILTER_COLLECTION_PATHS.some((path) => pathname === path);
}

export function getGlobalBrandFilterSearch(currentSearch: string) {
  const currentParams = new URLSearchParams(currentSearch);
  const brands = [...new Set(currentParams.getAll("brand").filter(Boolean))];
  if (brands.length === 0) return "";

  const nextParams = new URLSearchParams();
  brands.forEach((brand) => nextParams.append("brand", brand));
  return `?${nextParams.toString()}`;
}

export function buildCollectionNavPathWithGlobalBrand(
  targetPath: string,
  currentSearch: string,
) {
  if (!collectionSupportsGlobalBrandFilter(targetPath)) return targetPath;
  return `${targetPath}${getGlobalBrandFilterSearch(currentSearch)}`;
}
