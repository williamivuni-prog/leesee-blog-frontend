import { describe, expect, it } from "vitest";

import { formatDate } from "./format";

describe("formatDate", () => {
  it("formats an ISO date for blog metadata", () => {
    expect(formatDate("2026-07-23T12:00:00.000Z")).toBe("Jul 23, 2026");
  });
});
