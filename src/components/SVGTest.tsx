import React, { useState } from 'react';

const SVGTest: React.FC = () => {

    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({x:-20, y:-20});
    const [offset, setOffset] = useState({x: 0, y: 0});

    const [isDragging, setIsDragging] = useState(false);

    const onMouseDown = (ev: React.MouseEvent<SVGElement, MouseEvent>) => {
        setIsDragging(true);

        const rect: ClientRect = document.getElementsByClassName('svg')[0].getBoundingClientRect();
        let nx = (ev.clientX - rect.left);
        let ny = (ev.clientY - rect.top);

        setOffset({x:nx, y:ny});

        ev.preventDefault();
    };

    const onMouseMove = (ev: React.MouseEvent<SVGElement, MouseEvent>) => {
        if (!isDragging) return;
        
        const rect: ClientRect = document.getElementsByClassName('svg')[0].getBoundingClientRect();

        const newOffsetX = (ev.clientX - rect.left);
        const nx = pos.x + newOffsetX - offset.x;

        const newOffsetY = (ev.clientY - rect.top);
        const ny = pos.y + newOffsetY - offset.y;

        setPos({x:nx, y:ny});
        setOffset({x:newOffsetX, y:newOffsetY});

        ev.preventDefault();
    };

    const onMouseUp = (ev: React.MouseEvent<SVGElement, MouseEvent>) => {
        setIsDragging(false);

        ev.preventDefault();
    };

    const onWheel = (ev: React.WheelEvent<SVGElement>) => {
        const newScale = scale * (1.0 - (ev.deltaY / 1000));
        const scaleDelta = newScale / scale;

        const rect: ClientRect = document.getElementsByClassName('svg')[0].getBoundingClientRect();

        let nx = (ev.clientX - rect.left) - (window.innerWidth / 2);
        nx = scaleDelta * (pos.x - nx) + nx;

        let ny = (ev.clientY - rect.top) - (window.innerHeight / 2) - 10;
        ny = scaleDelta * (pos.y - ny) + ny;
        
        setScale(newScale);
        setPos({x:nx, y:ny});
    };

    return (
        <svg 
            className="svg"
            width={window.innerWidth} 
            height={window.innerHeight - 10} 
            style={{backgroundColor: '#478'}}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onWheel={onWheel}>
            <g transform={`matrix(1,0,0,1,${window.innerWidth / 2},${window.innerHeight / 2 - 10})`}>
                <g transform={`matrix(${scale},0,0,${scale},${pos.x},${pos.y})`}>
                    <rect 
                        width="40" 
                        height="40" 
                        style={{fill:'rgb(40,40,40)'}}></rect>
                </g>
            </g>
        </svg>
    );
}
  
export default SVGTest;
  