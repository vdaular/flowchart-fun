import { useContext, useMemo } from "react";
import { useLocation, useParams, useRouteMatch } from "react-router-dom";

import { AppContext } from "../components/AppContext";
import { slugify } from "./helpers";
import { useDocDetails } from "./useDoc";

export function getAnimationSettings() {
  const query = new URLSearchParams(window.location.search.slice(1));
  const animation = query.get("animation");
  return animation === "0" ? false : true;
}

export function useFullscreen() {
  const { pathname } = useLocation();
  const { path } = useRouteMatch();
  return pathname === "/f" || path === "/p/:public_id";
}

export function useIsReadOnly() {
  const { path } = useRouteMatch();
  return (
    path === "/p/:public_id" ||
    path === "/f" ||
    path === "/c/:graphText?" ||
    path === "/r/:graphText?"
  );
}

export function useIsLocalChart() {
  const { path } = useRouteMatch();
  return useMemo(() => path === "/:workspace" || path === "/", [path]);
}

export function useIsPublicHostedCharted() {
  const { path } = useRouteMatch();
  return useMemo(() => path === "/p/:public_id", [path]);
}

/** Use this to determine if the sponsor is valid.
 * That means their subscription is currently active.
 * i.e. They're in good standing, etc. */
export function useIsValidSponsor() {
  const { customer } = useContext(AppContext);
  return Boolean(customer?.subscription?.status === "active");
}

/**
 * Use this to determine if they are auth'd
 * Even if their payment is past due, they're still logged in.
 */
export function useIsValidCustomer() {
  const { customer } = useContext(AppContext);
  return Boolean(customer?.subscription);
}

/**
 * Returns the workspace title for a local chart
 * or the chart title slugified for a hosted chart
 */
export function useDownloadFilename() {
  const rawTitle = useDocDetails("title", "flowchart-fun");
  return slugify(rawTitle);
}

/**
 * Return a unique ID for any chart (local or hosted)
 * Hosted charts will return their database ID
 * Local charts will return their workspace name
 */
export function useChartId() {
  const { workspace = "_index" } = useParams<{ workspace?: string }>();
  const { path, params } = useRouteMatch<{ id?: string }>();
  const id = params.id || undefined;
  if (path === "/u/:id") return id;
  return workspace;
}

export function useIsFirefox() {
  const ua = window.navigator.userAgent;
  return ua.includes("Firefox");
}

/**
 * Returns whether showing the two-column editor view
 * Equivalent to the old "editor" tab
 * So it returns true for hosted and local charts, read only charts, and the help page
 *
 * It's used to alter CSS with data-showing
 */
export function useIsEditorView() {
  const { path, isExact } = useRouteMatch();
  return (
    path === "/u/:id" ||
    path === "/c/:graphText?" ||
    path === "/r/:graphText?" ||
    path === "/h" ||
    path === "/:workspace" ||
    (path === "/" && isExact)
  );
}

export function useLightOrDarkMode() {
  return useContext(AppContext).mode;
}
