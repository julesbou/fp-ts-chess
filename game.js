"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("readline");
const Apply_1 = require("fp-ts/Apply");
const Console_1 = require("fp-ts/Console");
const function_1 = require("fp-ts/function");
const O = require("fp-ts/Option");
const pipeable_1 = require("fp-ts/pipeable");
const Random_1 = require("fp-ts/Random");
const T = require("fp-ts/Task");
const board_1 = require("./board");
//
// helpers
//
// read from standard input
const getStrLn = () => new Promise((resolve) => {
    const rl = readline_1.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('> ', (answer) => {
        rl.close();
        resolve(answer);
    });
});
// write to standard output
const putStrLn = function_1.flow(Console_1.log, T.fromIO);
// ask something and get the answer
function ask(question) {
    return pipeable_1.pipe(putStrLn(question), T.chain(() => getStrLn));
}
// get a random int between 1 and 5
const random = T.fromIO(Random_1.randomInt(1, 5));
// parse a string to an integer
function parse(s) {
    const i = +s;
    return isNaN(i) || i % 1 !== 0 ? O.none : O.some(i);
}
//
// game
//
function shouldContinue(name) {
    return pipeable_1.pipe(ask(`Do you want to continue, ${name} (y/n)?`), T.chain((answer) => {
        switch (answer.toLowerCase()) {
            case 'y':
                return T.of(true);
            case 'n':
                return T.of(false);
            default:
                return shouldContinue(name);
        }
    }));
}
// run `n` tasks in parallel
const ado = Apply_1.sequenceS(T.task);
function gameLoop(name) {
    return pipeable_1.pipe(ado({
        secret: random,
        guess: ask(`Dear ${name}, please guess a number from 1 to 5`)
    }), T.chain(({ secret, guess }) => pipeable_1.pipe(parse(guess), O.fold(() => putStrLn('You did not enter an integer!'), (x) => x === secret
        ? putStrLn(`You guessed right, ${name}!`)
        : putStrLn(`You guessed wrong, ${name}! The number was: ${secret}`)))), T.chain(() => shouldContinue(name)), T.chain((b) => (b ? gameLoop(name) : T.of(undefined))));
}
const main = pipeable_1.pipe(ask('What is your name?'), T.chainFirst((name) => putStrLn(`Hello, ${name} welcome to the game!`)), T.chain(gameLoop));
console.log(board_1.printBoard(board_1.defaultBoard));
// tslint:disable-next-line: no-floating-promises
main();
