import { expect, test } from "@playwright/test";

test("landing page exposes the main product flow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Big files"
  );
  await expect(page.getByRole("button", { name: /start transfer/i })).toBeVisible();
  await expect(page.getByText("No server storage")).toBeVisible();
});

test("how it works page explains the transfer", async ({ page }) => {
  await page.goto("/how-it-works");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "private room"
  );
  await expect(page.getByText("Nothing stored")).toBeVisible();
});

test("403 page has recovery actions", async ({ page }) => {
  await page.goto("/403");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "not yours to enter"
  );
  await expect(page.getByRole("link", { name: /start a new transfer/i })).toBeVisible();
});
