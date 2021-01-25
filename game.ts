import { createInterface } from 'readline'
import { sequenceS } from 'fp-ts/Apply'
import { log } from 'fp-ts/Console'
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'
import { randomInt } from 'fp-ts/Random'
import * as T from 'fp-ts/Task'

import { defaultBoard, printBoard } from './board'

//
// helpers
//

// read from standard input
const getStrLn: T.Task<string> = () =>
  new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question('> ', (answer) => {
      rl.close()
      resolve(answer)
    })
  })

// write to standard output
const putStrLn = flow(log, T.fromIO)

// ask something and get the answer
function ask(question: string): T.Task<string> {
  return pipe(
    putStrLn(question),
    T.chain(() => getStrLn)
  )
}

// get a random int between 1 and 5
const random = T.fromIO(randomInt(1, 5))

// parse a string to an integer
function parse(s: string): O.Option<number> {
  const i = +s
  return isNaN(i) || i % 1 !== 0 ? O.none : O.some(i)
}

//
// game
//

function shouldContinue(name: string): T.Task<boolean> {
  return pipe(
    ask(`Do you want to continue, ${name} (y/n)?`),
    T.chain((answer) => {
      switch (answer.toLowerCase()) {
        case 'y':
          return T.of(true)
        case 'n':
          return T.of(false)
        default:
          return shouldContinue(name)
      }
    })
  )
}

// run `n` tasks in parallel
const ado = sequenceS(T.task)

function gameLoop(name: string): T.Task<void> {
  return pipe(
    ado({
      secret: random,
      guess: ask(`Dear ${name}, please guess a number from 1 to 5`)
    }),
    T.chain(({ secret, guess }) =>
      pipe(
        parse(guess),
        O.fold(
          () => putStrLn('You did not enter an integer!'),
          (x) =>
            x === secret
              ? putStrLn(`You guessed right, ${name}!`)
              : putStrLn(`You guessed wrong, ${name}! The number was: ${secret}`)
        )
      )
    ),
    T.chain(() => shouldContinue(name)),
    T.chain((b) => (b ? gameLoop(name) : T.of(undefined)))
  )
}

const main: T.Task<void> = pipe(
  ask('What is your name?'),
  T.chainFirst((name) => putStrLn(`Hello, ${name} welcome to the game!`)),
  T.chain(gameLoop)
)

console.log(printBoard(defaultBoard))

// tslint:disable-next-line: no-floating-promises
main()