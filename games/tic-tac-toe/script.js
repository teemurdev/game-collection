let currentPlayer = "X";
const cells = document.querySelectorAll(".cell");

const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
]

function checkWinner() {
    for (let combo of winningCombinations) {
        const [a,b,c] = combo;

        if (
            cells[a].textContent !== "" &&
            cells[b].textContent === cells[a].textContent &&
            cells[c].textContent === cells[a].textContent
        ) {
            return cells[a].textContent;
        }
    }
    return null;
}

cells.forEach(cell => {
  cell.addEventListener("click", () => {
    if (cell.textContent === "") {
      cell.textContent = currentPlayer;

      const winner = checkWinner();
      if (winner && document.getElementById("status").textContent === "") {
        document.getElementById("status").textContent = winner + " is winner";
      }

      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
  });
});
