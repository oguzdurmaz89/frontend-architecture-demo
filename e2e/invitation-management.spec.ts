import { expect, test } from "@playwright/test";

test.describe("Invitation management", () => {
  test("admin can create, edit and delete an invitation", async ({ page }) => {
    const uniqueId = Date.now();
    const originalName = `E2E Test User ${uniqueId}`;
    const updatedName = `E2E Updated User ${uniqueId}`;
    const email = `e2e-${uniqueId}@example.com`;

    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /create invitation/i }),
    ).toBeVisible();

    await page
      .getByRole("textbox", { name: "Name", exact: true })
      .fill(originalName);
    await page.getByRole("textbox", { name: "Email", exact: true }).fill(email);
    await page
      .getByRole("textbox", { name: "Locale", exact: true })
      .fill("en-US");
    await page.getByLabel("Role", { exact: true }).selectOption("clinician");

    await page.getByRole("button", { name: "Create invitation" }).click();

    const invitationsTable = page.getByRole("table", { name: "Invitations" });

    await expect(
      invitationsTable.getByRole("cell", { name: originalName, exact: true }),
    ).toBeVisible();

    await expect(
      invitationsTable.getByRole("cell", { name: email, exact: true }),
    ).toBeVisible();

    await page
      .getByRole("button", { name: `Edit invitation for ${originalName}` })
      .click();

    const editDialog = page.getByRole("dialog", { name: "Edit invitation" });

    await expect(editDialog).toBeVisible();

    await editDialog
      .getByRole("textbox", { name: "Name", exact: true })
      .fill(updatedName);

    await editDialog
      .getByLabel("Status", { exact: true })
      .selectOption("accepted");

    await editDialog.getByRole("button", { name: "Save changes" }).click();

    await expect(editDialog).toHaveCount(0);

    await expect(
      invitationsTable.getByRole("cell", { name: updatedName, exact: true }),
    ).toBeVisible();

    await expect(
      invitationsTable.getByRole("cell", { name: originalName, exact: true }),
    ).toHaveCount(0);

    await page
      .getByRole("button", { name: `Delete invitation for ${updatedName}` })
      .click();

    const deleteDialog = page.getByRole("dialog", {
      name: "Delete invitation",
    });

    await expect(deleteDialog).toBeVisible();

    await deleteDialog
      .getByRole("button", { name: "Delete invitation" })
      .click();

    await expect(deleteDialog).toHaveCount(0);

    await expect(
      invitationsTable.getByRole("cell", { name: updatedName, exact: true }),
    ).toHaveCount(0);
  });

  test("viewer can read invitations but cannot mutate them", async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .getByRole("group", { name: "Select demo role" })
      .getByRole("button", { name: "Viewer" })
      .click();

    await expect(
      page.getByRole("heading", { name: "Invitations" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Create invitation" }),
    ).toHaveCount(0);

    await expect(
      page.getByRole("button", { name: /edit invitation for/i }),
    ).toHaveCount(0);

    await expect(
      page.getByRole("button", { name: /delete invitation for/i }),
    ).toHaveCount(0);

    await expect(page.getByText(/read-only mode/i)).toBeVisible();
  });
});
