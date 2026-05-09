import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TreeView, type TreeViewNode } from "./TreeView";
import type { SidePanelNode } from "./SidePanel";

const tree: TreeViewNode[] = [
  {
    id: "1",
    slug: "root",
    title: "Root",
    score: 0,
    children: [
      { id: "2", slug: "child-a", title: "Child A", score: 5, children: [] },
      { id: "3", slug: "child-b", title: "Child B", score: -2, children: [] },
    ],
  },
];

const makeFetchNode = () =>
  vi.fn(
    async (slug: string): Promise<SidePanelNode> => ({
      id: slug,
      slug,
      title: slug,
      body: `Body of ${slug}`,
      outputs: [],
      authorUsername: "mark",
      parentId: null,
      status: "active",
      score: 0,
      alignmentKarma: 0,
      userVote: 0,
      comments: [],
      relatedProposals: [],
    }),
  );

describe("TreeView", () => {
  it("renders all node titles", () => {
    render(<TreeView tree={tree} fetchNode={makeFetchNode()} />);
    expect(screen.getByRole("button", { name: /Root/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Child A/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Child B/i })).toBeInTheDocument();
  });

  it("renders score next to each node", () => {
    render(<TreeView tree={tree} fetchNode={makeFetchNode()} />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("-2")).toBeInTheDocument();
  });

  it("does not show side panel initially", () => {
    render(<TreeView tree={tree} fetchNode={makeFetchNode()} />);
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });

  it("opens the side panel for the clicked node", async () => {
    const fetchNode = makeFetchNode();
    render(<TreeView tree={tree} fetchNode={fetchNode} />);
    fireEvent.click(screen.getByRole("button", { name: /Child A/i }));
    await screen.findByLabelText(/details for child-a/i);
    expect(fetchNode).toHaveBeenCalledWith("child-a");
  });

  it("swaps panel content when a different node is clicked", async () => {
    const fetchNode = makeFetchNode();
    render(<TreeView tree={tree} fetchNode={fetchNode} />);
    fireEvent.click(screen.getByRole("button", { name: /Child A/i }));
    await screen.findByLabelText(/details for child-a/i);
    fireEvent.click(screen.getByRole("button", { name: /Child B/i }));
    await screen.findByLabelText(/details for child-b/i);
    expect(
      screen.queryByLabelText(/details for child-a/i),
    ).not.toBeInTheDocument();
  });

  it("closes the side panel when close button clicked", async () => {
    render(<TreeView tree={tree} fetchNode={makeFetchNode()} />);
    fireEvent.click(screen.getByRole("button", { name: /Child A/i }));
    await screen.findByLabelText(/details for child-a/i);
    fireEvent.click(screen.getByRole("button", { name: /close panel/i }));
    expect(
      screen.queryByLabelText(/details for child-a/i),
    ).not.toBeInTheDocument();
  });
});
