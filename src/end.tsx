import React from 'react';
import './end.css';

const endGame = (props: string[], resetGame: () => void) => {
	const renderWords = () => {
		return props.map((item, index) => {
			return <li key={index}>{item}</li>;
		});
	};

	return (
		<>
			<div className='endGame'>
				<h1>Koniec gry!</h1>
				<p>Punkty: {props.length}</p>
				<p>Odgadnięte hasła: </p>
				{renderWords()}
				<button onClick={resetGame}>Reset</button>
			</div>
		</>
	);
};

export default endGame;
