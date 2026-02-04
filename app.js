const display = document.getElementById("display");

let expr = "";
let justEvualated = false;

function render() {
    display.textContent = expr || "0";
}

function isOperator(ch) {
    return ["+", "-", "*", "/", "%"].includes(ch);
}

function appendValue(v) {
    if (justEvualated && /[0-9.]/.test(v)) {
        expr = "";
    }
    justEvualated = false;

    const last = expr.slice(-1);

    if (isOperator(v) && isOperator(last)) {
        expr = expr.slice(0, -1) + v;
        render()
        return;
    }
    
    if (v === ".") {
        const parts = expr.split(/[\+\-\*\%]/);
        const current = parts[parts.length - 1];
        if (current.includes(".")) return;
        if (current === "") expr += "0";
    }

    expr += v;
    render()
}

function clearAll() {
    expr = "";
    justEvualated = false;
    render();
}

function backspace() {
    expr = expr.slice(0, -1)
    justEvualated = false;
    render ();
}

function safeEval(expression) {
    if (!/^[0-9+\-*/%. ]+$/.test(expression)) return "Error";

    const trimmed = expression.trim();
    if (trimmed === "" || isOperator(trimmed.slice(-1))) return "Error";

    try {
        const result = Function(`"use strict"; return (${trimmed});`)();
        if (!Number.isFinite(result)) return "Error";
        return String(result);
    } catch {
        return "Error";
    }
}

function equals() {
    const out = safeEval(expr);
    expr = out === "Error" ? "" : out;
    justEvualated = true;
    display.textContent = out;
}

document.querySelector(".keys").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  if (action === "clear") return clearAll();
  if (action === "back") return backspace();
  if (action === "equals") return equals();
  if (value) return appendValue(value);
});

window.addEventListener("keydown", (e) => {
  const k = e.key;

  if (k === "Enter" || k === "=") return equals();
  if (k === "Backspace") return backspace();
  if (k === "Escape") return clearAll();

  if (/[0-9+\-*/%.]/.test(k)) return appendValue(k);
  if (k === ".") return appendValue(".");
});

render();