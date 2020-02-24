import React from 'react';
import Button from './button';

function BB(props){
            return (
                <div id="select-Operation">
                     <div id="left-container">
                             <div id="left-button-container">
                                <div>
                                    {
                                        props.chain.substring(7,8)==="1" && 
                                            <Button style={props.buttonHover.FDK1} onMouseEnter={()=>props.onMouse("FDK1")} onMouseLeave={()=>props.onMouse("NONE")} id={"FDK1"} action={()=>props.action("FDK1TOUCH")} texto={props.texto[0]}></Button>    
                                    }
                                </div>
                                <div>
                                    {
                                        props.chain.substring(6,7)==="1" && 
                                            <Button style={props.buttonHover.FDK2} onMouseEnter={()=>props.onMouse("FDK2")} onMouseLeave={()=>props.onMouse("NONE")} id={"FDK2"} action={()=>props.action("FDK2TOUCH")} texto={props.texto[1]}></Button>    
                                    }
                                </div>
                                <div>
                                    {
                                        props.chain.substring(5,6)==="1" && 
                                            <Button style={props.buttonHover.FDK3} onMouseEnter={()=>props.onMouse("FDK3")} onMouseLeave={()=>props.onMouse("NONE")} id={"FDK3"} action={()=>props.action("FDK3TOUCH")} texto={props.texto[2]}></Button>    
                                    }
                                </div>
                                <div>
                                    {
                                        props.chain.substring(4,5)==="1" && 
                                            <Button style={props.buttonHover.FDK4} onMouseEnter={()=>props.onMouse("FDK4")} onMouseLeave={()=>props.onMouse("NONE")} id={"FDK4"} action={()=>props.action("FDK4TOUCH")} texto={props.texto[3]}></Button>    
                                    }
                                </div>
                            </div>
                     </div>
                     <div id="middle-container">
                                {props.component}
                     </div>
                     <div id="right-container">
                             <div id="right-button-container">
                                <div>
                                        {
                                            props.chain.substring(3,4)==="1" && 
                                                <Button style={props.buttonHover.FDK5} onMouseEnter={()=>props.onMouse("FDK5")} onMouseLeave={()=>props.onMouse("NONE")} id={"FDK5"} action={()=>props.action("FDK5TOUCH")} texto={props.texto[4]}></Button>         
                                        }
                                </div>
                                <div>
                                    {
                                        props.chain.substring(2,3)==="1" && 
                                            <Button style={props.buttonHover.FDK6} onMouseEnter={()=>props.onMouse("FDK6")} onMouseLeave={()=>props.onMouse("NONE")} id={"FDK6"} action={()=>props.action("FDK6TOUCH")} texto={props.texto[5]}></Button>    
                                    }
                                </div>
                                <div>
                                    {
                                        props.chain.substring(1,2)==="1" && 
                                            <Button style={props.buttonHover.FDK7} onMouseEnter={()=>props.onMouse("FDK7")} onMouseLeave={()=>props.onMouse("NONE")} id={"FDK7"} action={()=>props.action("FDK7TOUCH")} texto={props.texto[6]}></Button>    
                                    }
                                </div>
                                <div>
                                    {
                                        props.chain.substring(0,1)==="1" && 
                                            <Button style={props.buttonHover.FDK8} onMouseEnter={()=>props.onMouse("FDK8")} onMouseLeave={()=>props.onMouse("NONE")} id={"FDK8"} action={()=>props.action("FDK8TOUCH")} texto={props.texto[7]}></Button>    
                                    }
                                </div>
                             </div>
                     </div>
                 </div>
            );
}
export default BB;