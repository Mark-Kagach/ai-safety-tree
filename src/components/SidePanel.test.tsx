import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SidePanel, type SidePanelNode } from "./SidePanel";

const baseNode: SidePanelNode = {
  id: "1",
  slug: "technical-ai-safety",
  title: "Technical AI Safety",
  body: "Body text here.",
  outputs: [],
  authorUsername: "mark",
  parentId: null,
  status: "active",
  score: 5,
  alignmentKarma: 0,
  userVote: 0,
  comments: [],
  relatedProposals: [],
};

describe("SidePanel", () => {
  it("renders nothing when no node is provided", () => {
    const { container } = render(
      <SidePanel node={null} onClose={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders title, body, author, and score", () => {
    render(<SidePanel node={baseNode} onClose={() => {}} />);
    expect(
      screen.getByRole("heading", { name: /technical ai safety/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/body text here/i)).toBeInTheDocument();
    expect(screen.getByText(/mark/i)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("fires onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(<SidePanel node={baseNode} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fires onVote with +1 when upvote clicked", () => {
    const onVote = vi.fn();
    render(
      <SidePanel node={baseNode} onClose={() => {}} onVote={onVote} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /upvote/i }));
    expect(onVote).toHaveBeenCalledWith(1);
  });

  it("fires onVote with -1 when downvote clicked", () => {
    const onVote = vi.fn();
    render(
      <SidePanel node={baseNode} onClose={() => {}} onVote={onVote} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /downvote/i }));
    expect(onVote).toHaveBeenCalledWith(-1);
  });

  it("renders all comments", () => {
    const nodeWithComments: SidePanelNode = {
      ...baseNode,
      comments: [
        {
          id: "c1",
          body: "First comment",
          authorUsername: "alice",
          createdAt: "2025-01-01T00:00:00Z",
        },
        {
          id: "c2",
          body: "Second comment",
          authorUsername: "bob",
          createdAt: "2025-01-02T00:00:00Z",
        },
      ],
    };
    render(<SidePanel node={nodeWithComments} onClose={() => {}} />);
    expect(screen.getByText("First comment")).toBeInTheDocument();
    expect(screen.getByText("Second comment")).toBeInTheDocument();
    expect(screen.getByText(/alice/)).toBeInTheDocument();
    expect(screen.getByText(/bob/)).toBeInTheDocument();
  });

  it("fires onComment with the body when form submitted", () => {
    const onComment = vi.fn();
    render(
      <SidePanel node={baseNode} onClose={() => {}} onComment={onComment} />,
    );
    const textarea = screen.getByPlaceholderText(/add a comment/i);
    fireEvent.change(textarea, { target: { value: "My comment" } });
    fireEvent.click(screen.getByRole("button", { name: /post comment/i }));
    expect(onComment).toHaveBeenCalledWith("My comment");
  });

  it("clears the comment textarea after submit", () => {
    render(
      <SidePanel node={baseNode} onClose={() => {}} onComment={() => {}} />,
    );
    const textarea = screen.getByPlaceholderText(
      /add a comment/i,
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Hi" } });
    fireEvent.click(screen.getByRole("button", { name: /post comment/i }));
    expect(textarea.value).toBe("");
  });

  it("does not fire onComment when body is empty/whitespace", () => {
    const onComment = vi.fn();
    render(
      <SidePanel node={baseNode} onClose={() => {}} onComment={onComment} />,
    );
    fireEvent.change(screen.getByPlaceholderText(/add a comment/i), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByRole("button", { name: /post comment/i }));
    expect(onComment).not.toHaveBeenCalled();
  });

  it("highlights the upvote button when userVote is +1", () => {
    render(
      <SidePanel
        node={{ ...baseNode, userVote: 1 }}
        onClose={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /upvote/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /downvote/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("highlights the downvote button when userVote is -1", () => {
    render(
      <SidePanel
        node={{ ...baseNode, userVote: -1 }}
        onClose={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: /downvote/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
