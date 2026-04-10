window.dataLayer = window.dataLayer || [];

function gtag() {
  window.dataLayer.push(arguments);
}

window.gtag = window.gtag || gtag;

window.gtag("js", new Date());
window.gtag("config", "G-Z5GRJZ8D1N");

window.trackFormSubmission = function trackFormSubmission(formName, pagePath) {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "form_submission", {
    form_name: formName,
    page_path: pagePath || window.location.pathname,
  });
};
