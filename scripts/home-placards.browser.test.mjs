import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const base = "http://127.0.0.1:4173";
const rooms = [
  ["momentum", "projects-keep-stalling", "Projects keep stalling.", "Find the Real Problem"],
  ["momentum", "people-arent-on-board", "People aren't getting on board.", "Build Alignment with Buy-In"],
  ["momentum", "busy-limited-progress", "Everyone is busy. Progress is limited.", "Prioritize the Backlog"],
  ["momentum", "changes-arent-sticking", "Changes aren't sticking.", "Find the Real Problem"],
  ["decisions", "choose-a-direction", "Several directions look promising.", "Make a Tough Decision"],
  ["decisions", "everything-is-priority", "Everything is a priority.", "Prioritize the Backlog"],
  ["decisions", "difficult-tradeoffs", "The tradeoffs are real and uncomfortable.", "Make a Tough Decision"],
  ["decisions", "allocate-resources", "Resources and ambition don't match.", "Prioritize the Backlog"],
  ["understanding", "information-no-picture", "We have information, but no shared picture.", "Develop Shared Understanding"],
  ["understanding", "competing-explanations", "Everyone has a different explanation.", "The Problem Framing Session"],
  ["understanding", "why-isnt-it-working", "Something important isn't working.", "Find the Real Problem"],
  ["understanding", "conditions-changing", "The conditions keep changing.", "Plan for Uncertainty"],
  ["possibilities", "same-ideas", "We keep circling the same ideas.", "The Opportunity Map"],
  ["possibilities", "challenge-direction", "A promising direction needs to be challenged.", "The Assumption Test"],
  ["possibilities", "need-alternatives", "We need real alternatives, not variations.", "Plan for Uncertainty"],
  ["possibilities", "opportunity-not-concrete", "The opportunity is exciting but not concrete.", "The Opportunity Map"],
  ["ai", "identify-the-floor", "We don't have a plan yet.", "AI: Where Do We Start?"],
  ["ai", "establish-the-floor", "Results depend on the person.", "AI: Increasing Capability"],
  ["ai", "raise-the-floor", "What works doesn't spread.", "AI: Increasing Capability"],
  ["ai", "lead-the-change", "Our AI spending lacks direction.", "AI: Measuring Results"],
  ["ai", "push-the-frontier", "Top performers are hitting limits.", "AI: Increasing Capability"]
];

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(base);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("local preview did not start");
}

async function swipe(cdp, from, to) {
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [from] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [to] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}

const server = spawn("python3", ["-m", "http.server", "4173", "--bind", "127.0.0.1"], {
  cwd: new URL("../", import.meta.url),
  stdio: "ignore"
});

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {})
  });

  for (const device of [
    { name: "desktop", viewport: { width: 1440, height: 900 } },
    { name: "phone", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
  ]) {
    const context = await browser.newContext(device);
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    for (const [floor, id, title, play] of rooms) {
      await page.goto(`${base}/#floor/${floor}/${id}`, { waitUntil: "networkidle" });
      const card = page.locator(`[data-room-id="${id}"]`);
      await assert.doesNotReject(() => card.waitFor({ state: "visible" }), `${device.name}: ${id} card renders`);
      await page.waitForFunction((roomId) => document.querySelector(`[data-room-id="${roomId}"]`)?.classList.contains("is-current"), id);
      await page.waitForFunction((roomId) => {
        const room = document.querySelector(`[data-room-id="${roomId}"]`);
        const track = room?.closest("[data-room-track]");
        return Boolean(room && track && Math.abs(track.scrollLeft - room.offsetLeft) <= 2);
      }, id);
      assert.equal(await card.locator("h3").textContent(), title, `${device.name}: ${id} title`);
      assert.equal(await card.getByText(/^The play I'd run:/).count(), 0, `${device.name}: play stays off static card`);
      assert.ok((await card.locator("p").first().textContent()).trim().length > 0, `${device.name}: ${id} feeling line`);
      await card.getByRole("link", { name: "Open the room" }).click();
      const dialog = page.locator("[data-exhibit-dialog]");
      await assert.doesNotReject(() => dialog.waitFor({ state: "visible", timeout: 5000 }), `${device.name}: ${id} dialog opens`);
      assert.equal(await dialog.locator("[data-dialog-title]").textContent(), title, `${device.name}: ${id} dialog title`);
      assert.match(await dialog.locator("[data-dialog-scenes]").textContent(), /^Picture an? .+ Or an? .+/);
      assert.equal(await dialog.locator("[data-dialog-passage] p").count(), 3, `${device.name}: ${id} dynamic paragraphs`);
      assert.equal(await dialog.locator("[data-dialog-passage] strong").first().textContent(), `The play I'd run: ${play}${/[.!?]$/.test(play) ? "" : "."}`);
      assert.equal(await dialog.locator("[data-dialog-passage] strong").nth(1).textContent(), "You leave with:");
      assert.equal(await dialog.getByText("This is a place to begin, not an automated diagnosis. The discovery call determines what would actually be useful.").count(), 1);
      assert.equal(await dialog.getByRole("button", { name: /Add to Collection|Remove from Collection/ }).count(), 1);
      assert.equal(await dialog.getByRole("link", { name: "Send Joe a Message" }).count(), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${device.name}: ${id} has no horizontal page overflow`);
    }

    await page.goto(`${base}/#floor/momentum/projects-keep-stalling`, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
    const firstCard = page.locator('[data-room-id="projects-keep-stalling"]');
    await firstCard.getByRole("button", { name: "Add to Collection" }).click();
    await page.locator("[data-collection-open]").first().click();
    const collection = page.locator("[data-collection-dialog]");
    await collection.waitFor({ state: "visible" });
    assert.equal(await collection.getByText("Projects keep stalling.", { exact: true }).count(), 1, `${device.name}: collection preserves title`);
    const contactHref = await collection.locator("[data-collection-inquire]").getAttribute("href");
    assert.equal(new URL(contactHref, base).searchParams.get("challenge"), "Projects keep stalling.");
    assert.deepEqual(consoleErrors, [], `${device.name}: no console or page errors`);
    await context.close();
  }

  const desktopNavigation = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopNavigation.goto(`${base}/#exhibit/momentum/projects-keep-stalling`, { waitUntil: "networkidle" });
  const desktopDialog = desktopNavigation.locator("[data-exhibit-dialog]");
  await desktopDialog.waitFor({ state: "visible" });
  await desktopDialog.hover({ position: { x: 700, y: 400 } });
  await desktopNavigation.mouse.wheel(400, 0);
  await desktopNavigation.waitForTimeout(700);
  assert.equal(await desktopDialog.locator("[data-dialog-title]").textContent(), "People aren't getting on board.");
  await desktopNavigation.keyboard.press("ArrowRight");
  assert.equal(await desktopDialog.locator("[data-dialog-title]").textContent(), "Everyone is busy. Progress is limited.");
  await desktopDialog.evaluate((dialog) => { dialog.scrollTop = dialog.scrollHeight; });
  await desktopNavigation.mouse.wheel(0, 400);
  await desktopNavigation.waitForTimeout(700);
  assert.equal(await desktopDialog.locator("[data-dialog-floor]").textContent(), "Better Decisions");
  assert.equal(await desktopDialog.evaluate((dialog) => dialog.open), true);
  await desktopNavigation.close();

  const tabletContext = await browser.newContext({ viewport: { width: 768, height: 700 }, hasTouch: true, isMobile: true });
  const tablet = await tabletContext.newPage();
  await tablet.goto(`${base}/#exhibit/momentum/projects-keep-stalling`, { waitUntil: "networkidle" });
  const tabletDialog = tablet.locator("[data-exhibit-dialog]");
  await tabletDialog.waitFor({ state: "visible" });
  const cdp = await tabletContext.newCDPSession(tablet);
  await swipe(cdp, { x: 650, y: 460 }, { x: 150, y: 460 });
  await tablet.waitForTimeout(700);
  assert.equal(await tabletDialog.locator("[data-dialog-title]").textContent(), "People aren't getting on board.");
  await swipe(cdp, { x: 110, y: 500 }, { x: 110, y: 140 });
  await tablet.waitForTimeout(300);
  assert.equal(await tabletDialog.locator("[data-dialog-floor]").textContent(), "Better Momentum");
  await tabletDialog.evaluate((dialog) => { dialog.scrollTop = dialog.scrollHeight; });
  await swipe(cdp, { x: 110, y: 500 }, { x: 110, y: 140 });
  await tablet.waitForTimeout(700);
  assert.equal(await tabletDialog.locator("[data-dialog-floor]").textContent(), "Better Decisions");
  assert.equal(await tabletDialog.evaluate((dialog) => dialog.open), true);
  await tabletContext.close();
} finally {
  if (browser) await browser.close();
  server.kill("SIGTERM");
}

console.log(`Browser placard acceptance passed for ${rooms.length} rooms, open-placard navigation, and desktop, phone, and tablet widths.`);
