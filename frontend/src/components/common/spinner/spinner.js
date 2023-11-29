import React from 'react';

function Spinner(props){
	return (
		<div className={"spinner col-sm-4 col-sm-offset-4"}>
			<div className={"loader " + props.className}></div>
		</div>        
	);
}

export default Spinner;