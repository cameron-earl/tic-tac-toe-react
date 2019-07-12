## Tic Tac Toe

### Play it here: [http://cameron-earl.github.io/tic-tac-toe-react](http://cameron-earl.github.io/tic-tac-toe-react)

This is a game was built with [React](https://reactjs.org/) and [Typescript](https://www.typescriptlang.org/), and was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It was my first adventure into [hooks](https://reactjs.org/docs/hooks-intro.html) and I was quite pleased how much they improved the React development experience.

You have the ability to play against another person or a CPU player, with your choice of several difficulties.

- **Random** - Picks moves randomly, making it about as challenging to defeat as your average 2-year-old.
- **Easy** - Will consistently go for the win or block you, but doesn't plan ahead. Despite being labelled easy, this is enough to make it challenging if you aren't careful.
- **Medium** - Will evaluate each spot to see how many opportunities it sets up for itself and for you and will move accordingly. However, it moves in a probabilistic way, so it can make mistakes or (occasionally) have a lucky break. This is most similar to a human player.
- **Hard** - Acts exactly like medium except it never deviates from the strategy or makes mistakes. If you know its weaknesses, this makes it easy to consistently defeat.
- **Perfect** - This will always act [optimally](https://xkcd.com/832/). The best you can hope for against this is that nobody scores. If you manage to beat it somehow, please let me know.
