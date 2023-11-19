import React from 'react';
import { useNavigate } from 'react-router-dom';

function Page2(){
    const navigate = useNavigate();
    return (
        <><div>
            <h1>Page 2</h1>
            <button onClick={()=>navigate(-1)}></button>
        </div></>
    );
}
export default Page2;
