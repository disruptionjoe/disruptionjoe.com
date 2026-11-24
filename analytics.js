(function () {
  "use strict";

  var MEASUREMENT_ID = "G-Z5GRJZ8D1N";
  var EVENT_NAMES = {
    orientation_complete: true,
    challenge_view: true,
    challenge_add: true,
    collection_view: true,
    form_start: true,
    generate_lead: true
  };
  var PARAM_NAMES = {
    floor_id: true,
    challenge_id: true,
    collection_count: true,
    cta_location: true,
    form_name: true
  };
  var CAMPAIGN_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var disabled = analyticsDisabled();
  var lastPagePath = "";

  function analyticsDisabled() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("lite") === "1" || params.get("noresize") === "1") return true;
    if (window["ga-disable-" + MEASUREMENT_ID] === true) return true;
    if (navigator.globalPrivacyControl === true) return true;
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return true;
    try {
      if (window.localStorage.getItem("djc-analytics-opt-out") === "1") return true;
    } catch (error) { /* Storage is optional. */ }
    return false;
  }

  function safeToken(value) {
    var token = String(value || "").toLowerCase().trim();
    return /^[a-z0-9][a-z0-9-]{0,79}$/.test(token) ? token : "";
  }

  function virtualPathFromUrl(input) {
    var url;
    try {
      url = new URL(input || window.location.href, window.location.origin);
    } catch (error) {
      return "/";
    }

    var pathname = url.pathname.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";
    var hash = url.hash.replace(/^#/, "");
    var parts = hash.split("/").filter(Boolean).map(safeToken);
    if (parts.some(function (part) { return !part; })) parts = [];

    if (parts[0] === "floor" && parts[1]) return "/floor/" + parts[1];
    if (parts[0] === "exhibit" && parts[1]) return "/floor/" + parts[1];
    if (parts[0] === "collection") return "/collection";
    if (parts[0] === "lobby") return "/lobby";
    if (parts[0] === "basement") return "/basement";
    if (parts[0] === "intro" || parts[0] === "threshold") return "/";
    return pathname;
  }

  function campaignLocation(input, pagePath) {
    var url;
    try {
      url = new URL(input || window.location.href, window.location.origin);
    } catch (error) {
      return window.location.origin + pagePath;
    }
    var clean = new URL(pagePath, url.origin);
    CAMPAIGN_PARAMS.forEach(function (name) {
      var value = url.searchParams.get(name);
      if (value) clean.searchParams.set(name, value.slice(0, 120));
    });
    return clean.href;
  }

  function safeReferrer() {
    if (!document.referrer) return "";
    try {
      var referrer = new URL(document.referrer);
      return referrer.origin + referrer.pathname;
    } catch (error) {
      return "";
    }
  }

  function cleanParams(params) {
    var clean = {};
    Object.keys(params || {}).forEach(function (name) {
      if (!PARAM_NAMES[name]) return;
      if (name === "collection_count") {
        var count = Number(params[name]);
        if (Number.isFinite(count)) clean[name] = Math.max(0, Math.min(100, Math.round(count)));
        return;
      }
      var token = safeToken(params[name]);
      if (token) clean[name] = token;
    });
    return clean;
  }

  function noop() {}

  var api = {
    measurementId: MEASUREMENT_ID,
    enabled: !disabled,
    track: noop,
    pageView: noop
  };
  window.djcAnalytics = api;
  window.trackFormSubmission = noop;

  if (disabled) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  var initialPagePath = virtualPathFromUrl(window.location.href);
  window.gtag("config", MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_path: initialPagePath,
    page_location: campaignLocation(window.location.href, initialPagePath),
    page_referrer: safeReferrer()
  });

  var tag = document.querySelector('script[data-djc-google-tag="' + MEASUREMENT_ID + '"]');
  if (!tag) {
    tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
    tag.setAttribute("data-djc-google-tag", MEASUREMENT_ID);
    tag.onerror = noop;
    document.head.appendChild(tag);
  }

  api.track = function track(eventName, params) {
    if (!EVENT_NAMES[eventName] || typeof window.gtag !== "function") return;
    var eventParams = cleanParams(params);
    if (new URLSearchParams(window.location.search).get("analytics_debug") === "1") eventParams.debug_mode = true;
    window.gtag("event", eventName, eventParams);
  };

  api.pageView = function pageView(path, title) {
    var pagePath = virtualPathFromUrl(path || window.location.href);
    if (pagePath === lastPagePath) return;
    lastPagePath = pagePath;
    var params = {
      page_path: pagePath,
      page_location: campaignLocation(window.location.href, pagePath),
      page_title: String(title || document.title || "").slice(0, 180),
      page_referrer: safeReferrer()
    };
    if (new URLSearchParams(window.location.search).get("analytics_debug") === "1") params.debug_mode = true;
    window.gtag("config", MEASUREMENT_ID, {
      send_page_view: false,
      page_path: params.page_path,
      page_location: params.page_location,
      page_referrer: params.page_referrer
    });
    window.gtag("event", "page_view", params);
  };

  window.trackFormSubmission = function trackFormSubmission(formName) {
    api.track("generate_lead", { form_name: formName || "contact" });
  };

  api.pageView(window.location.href, document.title);
})();
