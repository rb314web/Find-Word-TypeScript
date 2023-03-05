import { useState, useEffect } from 'react';
import data from './data';
import endGame from './end';
import './style.css';

const Game = () => {
	useEffect(() => {
		drawWord();
	}, []);

	useEffect(() => {
		const Timer = setInterval(() => {
			setTimer((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(Timer);
	}, []);

	const [input, setInput] = useState<string>('');
	const [drawnWord, setDrawnWord] = useState<string[]>(['', '']);
	const [createdBoxses, setCreatedBoxses] = useState<JSX.Element[]>();
	const [timer, setTimer] = useState<number>(300);
	const [points, setPoints] = useState<string[]>([]);
	const [buttonState, setButtonState] = useState<boolean>(true);

	const handleKeyDown = (event: KeyboardEvent) => {

		if (event.keyCode === 13) {
			checkLetter()
		}

	  };

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
	
		// cleanup this component
		return () => {
		  window.removeEventListener('keydown', handleKeyDown);
		};
	  }, [input]);



	useEffect(() => {
		createbox();
	}, [drawnWord]);

	const drawWord = () => {
		const letterbox = document.querySelector('.letterbox') as HTMLElement;

		const dataWithoutGuessed = data.map((i) => {
			return {
				category: i.category,
				word: i.word.filter((x) => !points.some((e) => e == x.toUpperCase())),
			};
		});

		const test3 = dataWithoutGuessed.filter((e) => !(e.word.length <= 0));

		const drawRandom = (data: { category: string; word: string[] }[]) => {
			const randomIndex: number = Math.floor(Math.random() * data.length);
			const obj = data[randomIndex];

			const randomIndex1 = Math.floor(Math.random() * obj.word.length);

			const item = obj.word[randomIndex1].toUpperCase();

			setDrawnWord([obj.category, item]);
		};

		if (test3.length <= 0) {
			letterbox.textContent = 'Koniec gry';
			letterbox.style.fontSize = '30px';
		} else {
			drawRandom(test3);
		}
	};

	const checkLetter = () => {
		const inputStyle = document.querySelector('input') as HTMLElement;
		let r = 0;

		createdBoxses &&
			createdBoxses.forEach((i) => {
				if (i.props.children.props.children === input) {
					const square = document.querySelector(
						`.square:nth-child(${Number(i.key) + 1})`
					) as HTMLElement;
					square.setAttribute('data-visible', 'visible');
					r = r + 1;
				}
			});
		if (r === 0) {
			inputStyle.style.boxShadow = '0px 0px 16px 0px red';
			setTimeout(() => {
				inputStyle.style.boxShadow = '0px 5px 10px 0px rgba(0, 0, 0, 0.5)';
			}, 1000);
		} else {
			inputStyle.style.boxShadow = '0px 0px 16px 0px green';
			setTimeout(() => {
				inputStyle.style.boxShadow = '0px 5px 10px 0px rgba(0, 0, 0, 0.5)';
			}, 1000);
		}

		checkWin();
	};

	const checkWin = () => {
		const boxLetter = document.querySelectorAll('.square');
		const input = document.querySelector('input') as HTMLElement;

		let x = 0;

		boxLetter.forEach((i) => {
			if (i.getAttribute('data-visible') === 'visible') {
				x++;
			}
		});

		if (x === boxLetter.length && !points.includes(drawnWord[1])) {
			setPoints((prev) => [...prev, drawnWord[1]]);

			document.querySelectorAll('.square').forEach((item) => {
				const item1 = item as HTMLElement;
				item1.style.boxShadow = '0px 0px 16px 0px rgba(22, 255, 0, 1)';
				setButtonState(false);
			});
		}
		input.focus();
		setInput('')
	};

	const hiddenbox = () => {
		let visibleLetter = Math.floor(drawnWord && drawnWord[1].length / 3);

		document.querySelectorAll('.square').forEach(() => {
			const dsfd = Math.floor(Math.random() * drawnWord[1].length);
			if (visibleLetter >= 0) {
				document
					.querySelectorAll('.square')
					[dsfd].setAttribute('data-visible', 'visible');
				visibleLetter--;
			}
			visibleLetter--;
		});
	};

	useEffect(() => {
		hiddenbox();
	}, [createdBoxses]);

	const createbox = () => {
		let word = drawnWord && drawnWord[1].split(/(?:)/u);

		const createboxes =
			word &&
			word.map((item, index) => (
				<div data-visible={'hidden'} key={index} className='square'>
					<span>{item}</span>
				</div>
			));

		setCreatedBoxses(createboxes);
	};

	const time = () => {
		const minutes = Math.floor(timer / 60);
		const second = timer - Math.floor(timer / 60) * 60;

		let time = `${minutes < 10 ? '0' + minutes : minutes}:${
			second < 10 ? '0' + second : second
		}`;
		return timer > 0 ? time : '00:00';
	};

	const nextWord = () => {
		const input = document.querySelector('input') as HTMLElement;

		document.querySelectorAll('.square').forEach((i) => {
			i.setAttribute('data-visible', 'hidden');
		});
		drawWord();

		document.querySelectorAll('.square').forEach((item) => {
			let f = item as HTMLElement;
			f.style.boxShadow = 'none';
		});
		input.focus();
		setButtonState(true);
	};

	const resetGame = () => {
		setTimer(300);
		setPoints([]);
		nextWord();
	};

	return (
		<>
			<h1>Kategoria: {drawnWord && drawnWord[0]} </h1>
			<div className='letterbox'>{createdBoxses}</div>
			<div className='wrapper'>
				<input
					onChange={(e) =>
						setInput(() =>
							(e.target.value.length <= 1 &&
								/^[a-zA-Z]+$/.test(e.target.value)) ||
							e.target.value === ''
								? e.target.value.toLocaleUpperCase()
								: ''
						)
					}
					value={input}></input>
				{buttonState ? (
					<button onClick={checkLetter}>Sprawdź!</button>
				) : (
					<button onClick={nextWord}>Następne</button>
				)}
			</div>
			<div className='points'>{points.length} pkt</div>
			<div className='timer'>
				{time() === '00:00' ? endGame(points, resetGame) : time()}
			</div>
		</>
	);
};

export default Game;
