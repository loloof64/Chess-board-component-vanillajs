# Chess board component

A chess board web component

## Component reference

Usage

```javascript
<loloof64-chessboard
    size="300"
    background="crimson"
    coordinates_color="yellow"
    white_cell_color="navajowhite"
    black_cell_color="peru"
    start_position="8/8/8/8/4pk2/8/8/4K3 b - - 0 1"
    reversed="true"
    origin_cell_color="red"
    target_cell_color="green"
    dnd_cross_color="purple"
    promotion_dialog_title="Promotion piece"
    white_player_human="true"
    black_player_human="false"
></loloof64-chessboard>
```

### Attributes

| Name                   | Purpose                                                   | Type    | Default                                                  |
|------------------------|-----------------------------------------------------------|---------|----------------------------------------------------------|
| size                   | Common size (width/height) of the board in pixels         | number  | 100.0                                                    |
| background             | Background color of the board outside zone                | string  | #124589                                                  |
| coordinatesColor       | Color of the coordinates around the board                 | string  | DarkOrange                                               |
| whiteCellColor         | Background color of the white cells of the board          | string  | GoldenRod                                                |
| blackCellColor         | Background color of the black cells of the board          | string  | brown                                                    |
| startPosition          | First loaded position in Forsyth-Edwards Notation         | string  | rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 |
| reversed               | Whether black side is on top or not                       | boolean | false                                                    |
| origin_cell_color      | Color of the origin cell of the Drag and Drop             | string  | crimson                                                  |
| target_cell_color      | Color of the current target cell of the Drag and Drop     | string  | ForestGreen                                              |
| dnd_cross_color        | Color of the Drag and Drop cross indicator                | string  | DimGrey                                                  |
| promotion_dialog_title | Title of the promotion selection dialog                   | string  | Select the promotion piece                               |
| white_player_human     | True if the white player is human, false for external (1) | boolean | true                                                     |
| black_player_human     | True if the black player is human, false for external (1) | boolean | true                                                     |

(1) External player means that, instead of playing its move with interaction on the board, call the method `playMove` in order to commit its move. A simple use case would be to let an engine play.

### Properties

* isWhiteTurn : Boolean. true if it is White turn, false otherwise.
* currentPosition: String. Returns the current position in Forsyth-Edwards Notation.


### Methods

* toggleSide() : Toggle the reversed state of the board: that is "Is black side at top ?"
* playMove({
        startCellFile, startCellRank,
        endCellFile, endCellRank,
        promotion = 'q',
  }): Tries to play the given move on the component, only if the current player is defined as an external user. Returns a Promise. All coordinates, integers, start from 0 (file 0 = 'A', rank 0 = '1'). Valid promotion values are 'q', 'r', 'b' and 'n'.

## Developers

You can build with the command (in the terminal) `$ npm run build` from the root of the project. Result will be in the `dist` folder.
But don't forget first to install all dependencies, with NodeJS : `npm install`.

## Credits

Original pieces vectors definitions from CBurnett and found on [Wikimedia commons](https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces).
Using [ChessJS library](https://github.com/jhlywa/chess.js), which is bundled in the produced script.