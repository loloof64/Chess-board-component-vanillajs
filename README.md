# Chess board component

A chess board web component

## Component reference

Usage

```javascript
<loloof64-chessboard
    size="222"
    background="crimson"
    coordinatesColor="yellow"
    whiteCellColor="navajowhite"
    blackCellColor="peru"
></loloof64-chessboard>
```

### Properties

| Name             | Role                                              | Type   | Default    |
|------------------|---------------------------------------------------|--------|------------|
| size             | Common size (width/height) of the board in pixels | number | 100.0      |
| background       | Background color of the board outside zone        | string | #124589    |
| coordinatesColor | Color of the coordinates around the board         | string | darkorange |
| whiteCellColor   | Background color of the white cells of the board  | string | goldenrod  |
| blackCellColor   | Background color of the black cells of the board  | string | brown      |

## Credits

Original pieces vectors definitions from CBurnett and found on [Wikimedia commons](https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces).
Using [ChessJS library](https://github.com/jhlywa/chess.js).