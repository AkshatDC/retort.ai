export function injectFloatingButton(onClickHandler) {
  const existing = document.getElementById("retort-floating-btn");
  if (existing) return;

  const button = document.createElement("button");
  button.id = "retort-floating-btn";
  button.innerText = "🧠 Retort";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "99999";
  button.style.padding = "10px 14px";
  button.style.backgroundColor = "#E43F35";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "6px";
  button.style.fontSize = "14px";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";

  button.addEventListener("click", onClickHandler);
  document.body.appendChild(button);
}
