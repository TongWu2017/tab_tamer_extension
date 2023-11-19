import { useState } from 'react';
import './App.css'
import React from 'react';

function Project(props) {
    const[liked, setLiked]=useState(false);

    return (
        <>
        <div>
            <h3>{props.title}</h3>
            {liked && <p>Like!</p>}
            <img style={{width: "50vw"}} src={props.url} onClick={()=>setLiked(!liked)}></img>
        </div>
        </>
    );
}

export default Project;
