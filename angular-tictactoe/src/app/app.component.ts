import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private renderer: Renderer2) {}

  displayBoard: boolean = true;
  players: any = { 1: 'X', 2: 'O'};
  state: any = { player: 1, positions: {} };
  winner: string;
  winningPositionCombinations: string[] = ['123', '456', '789', '147', '258', '369', '159', '357'];
  
  // Move current player (if possible).
  move = (row: number, col: number, event: any) => {
    const position: number = 3 * row + col;
    if (this.winner || this.isPositionTaken(position)) { return; }
    this.claimPosition(position, event);
    if (this.isPlayerWinning(position)) {
      this.winner = this.player;
    } else {
      this.switchPlayer();
    }
  }

  // Get current player.
  get player(): string {
    return this.players[this.state.player];
  }

  // Check if requested position is taken.
  isPositionTaken = (position: number): boolean => !!this.state.positions[position];

  // Claim requested position.
  claimPosition = (position: number, event: any): void => {
    this.renderer.addClass(event.target, this.player);
    this.state.positions[position] = this.player;
  }

  // Switch player.
  switchPlayer = (): number => this.state.player = this.state.player === 1 ? 2 : 1;

  // Return winning position if player won.
  isPlayerWinning = (position: number): boolean => !!this.winningPositionCombinations
    // Iterate each position in each winning combination.
    .find(winningPositionCombination => winningPositionCombination.split('')
      // Return true if player exist in all positions in the winning combination.
      .filter(position => this.state.positions[position] === this.player).length === 3);

  // Reset the game.
  resetGame = (_: any) => {
    this.winner = null;
    this.state.positions = {};
    setTimeout(() => this.displayBoard = false);
    setTimeout(() => this.displayBoard = true);
  }
}
