import { describe, it, expect } from "vitest";
import { pruneCollapsed, type CollapsibleTreeNode } from "./collapse";

const sample: CollapsibleTreeNode[] = [
  {
    id: "1",
    children: [
      {
        id: "2",
        children: [{ id: "3", children: [] }],
      },
      { id: "4", children: [] },
    ],
  },
];

describe("pruneCollapsed", () => {
  it("returns the tree unchanged when no ids are collapsed", () => {
    expect(pruneCollapsed(sample, new Set())).toEqual(sample);
  });

  it("does not mutate the input tree", () => {
    const before = JSON.parse(JSON.stringify(sample));
    pruneCollapsed(sample, new Set(["1"]));
    expect(sample).toEqual(before);
  });

  it("hides children of a collapsed node", () => {
    const result = pruneCollapsed(sample, new Set(["1"]));
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
    expect(result[0].children).toEqual([]);
  });

  it("hides only the subtree of the collapsed id, leaving siblings intact", () => {
    const result = pruneCollapsed(sample, new Set(["2"]));
    expect(result[0].children).toHaveLength(2);
    const collapsed = result[0].children.find((c) => c.id === "2");
    const sibling = result[0].children.find((c) => c.id === "4");
    expect(collapsed?.children).toEqual([]);
    expect(sibling?.children).toEqual([]);
  });

  it("collapses nested ids independently", () => {
    const result = pruneCollapsed(sample, new Set(["2", "4"]));
    expect(result[0].children.find((c) => c.id === "2")?.children).toEqual([]);
    expect(result[0].children.find((c) => c.id === "4")?.children).toEqual([]);
  });

  it("ignores collapsed ids that are not in the tree", () => {
    expect(pruneCollapsed(sample, new Set(["does-not-exist"]))).toEqual(sample);
  });

  it("preserves additional fields on each node", () => {
    type Extra = CollapsibleTreeNode & { title: string };
    const tree: Extra[] = [
      {
        id: "1",
        title: "Root",
        children: [{ id: "2", title: "Child", children: [] }],
      },
    ];
    const result = pruneCollapsed(tree, new Set());
    expect(result[0].title).toBe("Root");
    expect((result[0].children[0] as Extra).title).toBe("Child");
  });
});
