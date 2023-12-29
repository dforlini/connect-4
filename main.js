document.addEventListener('DOMContentLoaded', () =>{
    let game;

document.getElementById('start-game').addEventListener('click', () => {
    let p1Color = document.getElementById('p1-color').value;
    let p2Color = document.getElementById('p2-color').value;
    new Game(p1Color, p2Color);
  });
});