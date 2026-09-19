export const SELECT_PACKAGE_EVENT = "select-package";

export function selectPackage(packageId: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(SELECT_PACKAGE_EVENT, { detail: packageId })
  );
}
