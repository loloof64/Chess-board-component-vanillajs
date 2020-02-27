# Chess board component

A chess board web component

## Component reference

Usage

```javascript
<loloof64-chessboard
    size="222"
    background="crimson"
    coordinates_color="yellow"
    white_cell_color="navajowhite"
    black_cell_color="peru"
    start_position="4r3/8/2p2PPk/1p6/pP2p1R1/P1B5/2P2K2/3r4 b - - 1 45"
    reversed="true"
></loloof64-chessboard>
```

### Properties

| Name             | Role                                              | Type    | Default                                                  |
|------------------|---------------------------------------------------|---------|----------------------------------------------------------|
| size             | Common size (width/height) of the board in pixels | number  | 100.0                                                    |
| background       | Background color of the board outside zone        | string  | #124589                                                  |
| coordinates_color | Color of the coordinates around the board         | string  | darkorange                                               |
| white_cell_color   | Background color of the white cells of the board  | string  | goldenrod                                                |
| black_cell_color   | Background color of the black cells of the board  | string  | brown                                                    |
| start_position    | First loaded position in Forsyth-Edwards Notation | string  | rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 |
| reversed         | Whether black side is on top or not               | boolean | false                                                    |

### Methods

* toggleSide() : Toggle the reversed state of the board: that is "Is black side at top ?"

## Credits

Original pieces vectors definitions from CBurnett and found on [Wikimedia commons](https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces).
Using [ChessJS library](https://github.com/jhlywa/chess.js).