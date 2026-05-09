import { describe, it, expect } from "vitest";
import { buildTree, type FlatNode } from "./tree";

describe("buildTree", () => {
  it("returns empty array when given no nodes", () => {
    expect(buildTree([])).toEqual([]);
  });

  it("returns a single root with no children when given one node", () => {
    const nodes: FlatNode[] = [
      { id: "1", parentId: null, title: "Root" },
    ];
    expect(buildTree(nodes)).toEqual([
      { id: "1", parentId: null, title: "Root", children: [] },
    ]);
  });

  it("nests a child under its parent", () => {
    const nodes: FlatNode[] = [
      { id: "1", parentId: null, title: "Root" },
      { id: "2", parentId: "1", title: "Child" },
    ];
    const tree = buildTree(nodes);
    expect(tree).toHaveLength(1);
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0].id).toBe("2");
  });

  it("supports multiple roots", () => {
    const nodes: FlatNode[] = [
      { id: "a", parentId: null, title: "Root A" },
      { id: "b", parentId: null, title: "Root B" },
    ];
    expect(buildTree(nodes)).toHaveLength(2);
  });

  it("supports multiple children under one parent", () => {
    const nodes: FlatNode[] = [
      { id: "1", parentId: null, title: "Root" },
      { id: "2", parentId: "1", title: "A" },
      { id: "3", parentId: "1", title: "B" },
    ];
    const tree = buildTree(nodes);
    expect(tree[0].children.map((c) => c.id)).toEqual(["2", "3"]);
  });

  it("supports deep nesting", () => {
    const nodes: FlatNode[] = [
      { id: "1", parentId: null, title: "Root" },
      { id: "2", parentId: "1", title: "Mid" },
      { id: "3", parentId: "2", title: "Leaf" },
    ];
    const tree = buildTree(nodes);
    expect(tree[0].children[0].children[0].id).toBe("3");
  });

  it("ignores input order — children declared before parents still nest", () => {
    const nodes: FlatNode[] = [
      { id: "3", parentId: "2", title: "Leaf" },
      { id: "2", parentId: "1", title: "Mid" },
      { id: "1", parentId: null, title: "Root" },
    ];
    const tree = buildTree(nodes);
    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe("1");
    expect(tree[0].children[0].children[0].id).toBe("3");
  });

  it("throws when a parentId references a missing node", () => {
    const nodes: FlatNode[] = [
      { id: "1", parentId: "ghost", title: "Orphan" },
    ];
    expect(() => buildTree(nodes)).toThrow(/missing parent/i);
  });

  it("throws when a cycle exists", () => {
    const nodes: FlatNode[] = [
      { id: "1", parentId: "2", title: "A" },
      { id: "2", parentId: "1", title: "B" },
    ];
    expect(() => buildTree(nodes)).toThrow(/cycle/i);
  });

  it("throws on duplicate ids", () => {
    const nodes: FlatNode[] = [
      { id: "1", parentId: null, title: "A" },
      { id: "1", parentId: null, title: "B" },
    ];
    expect(() => buildTree(nodes)).toThrow(/duplicate/i);
  });
});
