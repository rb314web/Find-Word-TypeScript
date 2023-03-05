import React from "react";

const StartPage = (props : any) => {
	return (
		<>
			<h1>Zgadnij słowo!</h1>
			<button onClick={props.test}>Start</button>
		</>
	);
};

export default StartPage;
