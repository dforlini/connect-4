class Player {
  constructor(color) {
    this.color = color;
  }
}
class Game {
  constructor(player1Color, player2Color, height = 6, width = 7) {
    this.HEIGHT = height;
    this.WIDTH = width;
    this.players = [new Player(player1Color), new Player(player2Color)];
    this.currPlayer = 0; // index of active player in the arr
    this.board = []; //arr of rows
    this.gameOver = false;
    this.makeBoard();
    this.makeHtmlBoard();
  }


  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }
  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
    board.append(top);

    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `cell-${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (this.board[y][x] === undefined) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const cellId = `cell-${y}-${x}`;
    const cell = document.getElementById(cellId);

    if (cell && cell.childElementCount === 0) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.backgroundColor = this.players[this.currPlayer].color;
      cell.append(piece);

      this.board[y][x] = this.currPlayer;
    }else {
    
    console.log(`cell ${y}, ${x} is occupied`);
    }
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
    this.gameOver = true;
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    console.log('clicked cell', evt.target.id);

    if (this.gameOver) return;

    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    console.log('placement', x, y);

    if (y === null) {
      console.log('column full or invalid target');
      return;
    }

    // place piece in board and add to HTML table
    this.placeInTable(y, x);
    this.board[y][x] = this.currPlayer;

    console.log(`board state after placement`, this.board);


    // check for win
    if (this.checkForWin()) {
      this.endGame(`Player ${this.currPlayer + 1} won!`);
    }

    // check for tie
    else if (this.board.every(row => row.every(cell => cell))) {
      this.endGame('Tie!');
    } else {

      // switch players
      this.currPlayer = this.currPlayer === 0 ? 1 : 0;
    }
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );


    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }

  }
}
