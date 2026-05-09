import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProposeForm, type ProposeFormParent } from "./ProposeForm";

const parents: ProposeFormParent[] = [
  { id: "1", title: "AI Safety" },
  { id: "2", title: "Technical AI Safety" },
];

describe("ProposeForm", () => {
  it("renders title input, body textarea, parent select, and submit button", () => {
    render(<ProposeForm parents={parents} onSubmit={() => {}} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/body/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/parent/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /propose/i }),
    ).toBeInTheDocument();
  });

  it("lists all parents in the dropdown", () => {
    render(<ProposeForm parents={parents} onSubmit={() => {}} />);
    expect(
      screen.getByRole("option", { name: "AI Safety" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Technical AI Safety" }),
    ).toBeInTheDocument();
  });

  it("disables submit when title is empty", () => {
    render(<ProposeForm parents={parents} onSubmit={() => {}} />);
    expect(
      screen.getByRole("button", { name: /propose/i }),
    ).toBeDisabled();
  });

  it("disables submit when body is empty", () => {
    render(<ProposeForm parents={parents} onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "New Node" },
    });
    expect(
      screen.getByRole("button", { name: /propose/i }),
    ).toBeDisabled();
  });

  it("enables submit when title and body are filled", () => {
    render(<ProposeForm parents={parents} onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "New Node" },
    });
    fireEvent.change(screen.getByLabelText(/body/i), {
      target: { value: "Body text" },
    });
    expect(
      screen.getByRole("button", { name: /propose/i }),
    ).not.toBeDisabled();
  });

  it("fires onSubmit with the form payload", () => {
    const onSubmit = vi.fn();
    render(<ProposeForm parents={parents} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Mesa-optimization" },
    });
    fireEvent.change(screen.getByLabelText(/body/i), {
      target: { value: "Inner alignment failure mode." },
    });
    fireEvent.change(screen.getByLabelText(/parent/i), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /propose/i }));
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Mesa-optimization",
      body: "Inner alignment failure mode.",
      parentId: "2",
    });
  });

  it("resets fields after submit", () => {
    render(<ProposeForm parents={parents} onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "New" },
    });
    fireEvent.change(screen.getByLabelText(/body/i), {
      target: { value: "Body" },
    });
    fireEvent.click(screen.getByRole("button", { name: /propose/i }));
    expect(
      (screen.getByLabelText(/title/i) as HTMLInputElement).value,
    ).toBe("");
    expect(
      (screen.getByLabelText(/body/i) as HTMLTextAreaElement).value,
    ).toBe("");
  });

  it("shows character count for body against the 2000-char cap", () => {
    render(<ProposeForm parents={parents} onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText(/body/i), {
      target: { value: "a".repeat(50) },
    });
    expect(screen.getByText(/50\s*\/\s*2000/)).toBeInTheDocument();
  });

  it("disables submit when body exceeds 2000 characters", () => {
    render(<ProposeForm parents={parents} onSubmit={() => {}} />);
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "New" },
    });
    fireEvent.change(screen.getByLabelText(/body/i), {
      target: { value: "a".repeat(2001) },
    });
    expect(
      screen.getByRole("button", { name: /propose/i }),
    ).toBeDisabled();
  });

  it("preselects the first parent if no defaultParentId given", () => {
    render(<ProposeForm parents={parents} onSubmit={() => {}} />);
    expect(
      (screen.getByLabelText(/parent/i) as HTMLSelectElement).value,
    ).toBe("1");
  });

  it("uses defaultParentId if given", () => {
    render(
      <ProposeForm
        parents={parents}
        defaultParentId="2"
        onSubmit={() => {}}
      />,
    );
    expect(
      (screen.getByLabelText(/parent/i) as HTMLSelectElement).value,
    ).toBe("2");
  });
});
